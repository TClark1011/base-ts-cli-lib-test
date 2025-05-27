import { join } from "path";
import { cwd } from "process";
import { title } from "radash";
import {
  ArrowFunction,
  FunctionDeclaration,
  Project,
  SyntaxKind,
  TypeFormatFlags,
  VariableStatement,
} from "ts-morph";
import ch from "chalk";
import { mkdirSync, writeFileSync } from "fs";
import assert from "assert";

const removeImportLines = (code: string): string => {
  const lines = code.split("\n");
  const filteredLines = lines.filter(
    (line) => !line.trim().startsWith("import"),
  );
  const joined = filteredLines.join("\n");

  // remove trailing new lines
  const trimmed = joined.replace(/\n+$/, "").trim();
  return trimmed;
};

const readableAsserts = (code: string): string =>
  code.replace(
    /(assert\.equal\(([^,]+),\s*([^,]+)\);?)/g,
    (_, fullMatch, varName, value) => {
      return `${varName.trim()}; // ${value.trim()}`;
    },
  );

const transformExampleCode = (code: string): string => {
  const withReadableAsserts = readableAsserts(code);
  const withoutImports = removeImportLines(withReadableAsserts);

  return withoutImports.trim();
};

const getVariableStatementName = (
  variableStatement: VariableStatement,
): string => {
  const declaration = variableStatement.getDeclarations()[0];
  if (!declaration) throw new Error(`No declaration found`);

  return declaration.getName();
};

const getFunctionSignatureText = (
  name: string,
  functionDeclaration: FunctionDeclaration | ArrowFunction,
): string => {
  // Get type parameters (generics)
  const typeParams = functionDeclaration.getTypeParameters();
  const genericsText =
    typeParams.length > 0
      ? `<${typeParams
          .map((tp) => {
            const constraint = tp.getConstraint();
            const defaultType = tp.getDefault();
            let text = tp.getName();
            if (constraint) text += ` extends ${constraint.getText()}`;
            if (defaultType) text += ` = ${defaultType.getText()}`;
            return text;
          })
          .join(", ")}>`
      : "";

  // Get parameters
  const params = functionDeclaration
    .getParameters()
    .map((p) => {
      const paramName = p.getName();
      const typeNode = p.getTypeNode();
      const paramType = typeNode ? typeNode.getText() : "any";
      const isOptional = p.isOptional();
      return `${paramName}${isOptional ? "?" : ""}: ${paramType}`;
    })
    .join(", ");

  // Get return type
  // const returnType = functionDeclaration.getReturnTypeNode()?.getText() ?? "any";
  const returnType =
    functionDeclaration
      .getReturnTypeNode()
      ?.getType()
      ?.getText(
        undefined,
        TypeFormatFlags.InTypeAlias | TypeFormatFlags.MultilineObjectLiterals,
      )
      ?.replaceAll(";", ";\n")
      ?.replaceAll("{", "{\n") ?? "any";

  return `function ${name}${genericsText}(${params}): ${returnType}`;
};

const LIB_PATH = join(cwd(), "../lib");

const libProject = new Project({
  tsConfigFilePath: join(LIB_PATH, "tsconfig.json"),
});
const examplesProject = new Project({
  tsConfigFilePath: join(LIB_PATH, "tsconfig.examples.json"),
});

const functionFiles = libProject.getSourceFiles(join(LIB_PATH, "src/*/*/*.ts"));

type FunctionFileListing = {
  category: string;
  functionName: string;
  description: string;
  functionSignature: string;
  exampleCode?: string;
};

const listings: FunctionFileListing[] = functionFiles
  .map((sourceFile) => {
    const fileName = sourceFile.getBaseName();
    const functionCategory = sourceFile
      .getDirectory()
      .getParent()
      ?.getBaseName();
    assert(functionCategory);
    const fileNameNoExt = sourceFile.getBaseNameWithoutExtension();

    try {
      const variableStatement = sourceFile.getVariableStatements()[0];
      if (!variableStatement) throw new Error(`No variable statement found`);

      const functionName = getVariableStatementName(variableStatement);

      const theJsDoc = variableStatement.getJsDocs()[0];
      if (!theJsDoc) throw new Error(`No JSDoc found`);

      const description = theJsDoc.getDescription().trim();

      const exampleSourceFile = examplesProject.getSourceFile(
        `${fileNameNoExt}.example.ts`,
      );
      const exampleCode = exampleSourceFile?.getFullText().trim();

      const arrowFunction = variableStatement.getFirstDescendantByKindOrThrow(
        SyntaxKind.ArrowFunction,
      );

      return {
        category: functionCategory,
        functionName,
        description,
        functionSignature: getFunctionSignatureText(
          functionName,
          arrowFunction,
        ),
        exampleCode: exampleCode
          ? transformExampleCode(exampleCode)
          : undefined,
      };
    } catch (err: any) {
      throw new Error(`${err.message} (${functionCategory}/${fileName})`);
    }
  })
  .filter((val) => !!val);

const functionsMissingExamples = listings
  .filter(({ exampleCode }) => !exampleCode)
  .map(({ category, functionName }) => `${category}/${functionName}`);

const createdDocFiles: string[] = [];

const OUTPUT_ROOT = join(cwd(), "../docs/src/content/docs/functions");
listings.forEach(
  ({ category, functionName, description, exampleCode, functionSignature }) => {
    const fileContents = [
      "---",
      `title: ${functionName}`,
      "---",
      "",
      description,
      "",
      ...(exampleCode
        ? ["## Example", "", "```ts", exampleCode, "```", ""]
        : []),
      "## Signature",
      "",
      "```ts",
      functionSignature,
      "```",
    ].join("\n");

    const categoryDir = join(OUTPUT_ROOT, category);

    mkdirSync(categoryDir, { recursive: true });

    const fileName = `${functionName}.md`;
    const filePathWithCategory = join(categoryDir, fileName);

    writeFileSync(filePathWithCategory, fileContents, { flag: "w" });

    createdDocFiles.push(`${category}/${fileName}`);
  },
);

if (createdDocFiles.length > 0) {
  console.log(
    ch.blue(ch.bold("Success:"), "Function documentation generated:"),
  );
  createdDocFiles.forEach((fileName) => {
    console.log(ch.blue(`- ${fileName}`));
  });
}

if (functionsMissingExamples.length > 0) {
  console.log();
  console.warn(
    ch.yellow(
      ch.bold("Warning:"),
      "The following functions are missing examples:",
    ),
  );
  functionsMissingExamples.forEach((fileName) => {
    console.warn(ch.yellow(`- ${fileName}`));
  });
}
