import { join } from 'path';
import { cwd } from 'process';
import { title } from 'radash';
import { ArrowFunction, FunctionDeclaration, Project, SyntaxKind, TypeFormatFlags, VariableStatement } from 'ts-morph';
import ch from 'chalk';
import { mkdirSync, writeFileSync } from 'fs';


const getVariableStatementName = (variableStatement: VariableStatement): string => {
	const declaration = variableStatement.getDeclarations()[0];
	if (!declaration) throw new Error(`No declaration found`);

	return declaration.getName();
}

const removeImportLines = (code: string): string => {
	const lines = code.split('\n');
	const filteredLines = lines.filter(line => !line.trim().startsWith('import'));
	const joined = filteredLines.join('\n');

	// remove trailing new lines
	const trimmed = joined.replace(/\n+$/, '').trim();
	return trimmed;
}

const getFunctionSignatureText = (name: string, functionDeclaration: FunctionDeclaration | ArrowFunction): string => {
	// Get type parameters (generics)
	const typeParams = functionDeclaration.getTypeParameters();
	const genericsText = typeParams.length > 0
		? `<${typeParams.map(tp => {
			const constraint = tp.getConstraint();
			const defaultType = tp.getDefault();
			let text = tp.getName();
			if (constraint) text += ` extends ${constraint.getText()}`;
			if (defaultType) text += ` = ${defaultType.getText()}`;
			return text;
		}).join(", ")}>`
		: "";

	// Get parameters
	const params = functionDeclaration.getParameters().map(p => {
		const paramName = p.getName();
		const typeNode = p.getTypeNode();
		const paramType = typeNode ? typeNode.getText() : "any";
		const isOptional = p.isOptional();
		return `${paramName}${isOptional ? "?" : ""}: ${paramType}`;
	}).join(", ");

	// Get return type
	// const returnType = functionDeclaration.getReturnTypeNode()?.getText() ?? "any";
	const returnType = functionDeclaration.getReturnTypeNode()
		?.getType()
		?.getText(undefined, TypeFormatFlags.InTypeAlias | TypeFormatFlags.MultilineObjectLiterals)
		?.replaceAll(';', ';\n')
		?.replaceAll('{', '{\n') ?? "any";

	return `function ${name}${genericsText}(${params}): ${returnType}`;
}


const LIB_PATH = join(cwd(), '../lib');


const libProject = new Project({
	tsConfigFilePath: join(LIB_PATH, 'tsconfig.json')
})
const examplesProject = new Project({
	tsConfigFilePath: join(LIB_PATH, 'tsconfig.examples.json'),
});

const functionFiles = libProject.getSourceFiles(join(LIB_PATH, 'src/*/*.ts'));


type FunctionFileListing = {
	category: string;
	functionName: string;
	description: string;
	functionSignature: string;
	exampleCode?: string;
}

const undocumentedFileNames: string[] = [];

const listings: FunctionFileListing[] = functionFiles.map(sourceFile => {
	const fileName = sourceFile.getBaseName();
	const directoryName = sourceFile.getDirectory().getBaseName();
	const fileNameNoExt = sourceFile.getBaseNameWithoutExtension();

	try {
		const variableStatement = sourceFile.getVariableStatements()[0];
		if (!variableStatement) throw new Error(`No variable statement found`);

		const functionName = getVariableStatementName(variableStatement);

		const theJsDoc = variableStatement.getJsDocs()[0];
		if (!theJsDoc) throw new Error(`No JSDoc found`);

		const description = theJsDoc.getDescription().trim();

		const exampleSourceFile = examplesProject.getSourceFile(`${fileNameNoExt}.example.ts`);
		const exampleCode = exampleSourceFile?.getFullText().trim();

		const arrowFunction = variableStatement.getFirstDescendantByKindOrThrow(SyntaxKind.ArrowFunction);

		return {
			category: directoryName,
			functionName,
			description,
			functionSignature: getFunctionSignatureText(functionName, arrowFunction),
			exampleCode: exampleCode ? removeImportLines(exampleCode).trim() : undefined,
		}

	} catch (err: any) {
		undocumentedFileNames.push(`${directoryName}/${fileName}`);
		// return undefined;
		throw new Error(`${err.message} (${directoryName}/${fileName})`);
	}
}).filter(val => !!val)


const createdDocFiles: string[] = [];

const OUTPUT_ROOT = join(cwd(), '../docs/src/content/docs/functions')
listings.forEach(({ category, functionName, description, exampleCode, functionSignature }) => {
	const fileContents = [
		'---',
		`title: ${functionName}`,
		'---',
		'',
		description,
		'',
		...(exampleCode ? [
			'## Example',
			'',
			'```ts',
			exampleCode,
			'```',
			'',
		] : []),
		'## Signature',
		'',
		'```ts',
		functionSignature,
		'```',

	].join('\n');

	const categoryDir = join(OUTPUT_ROOT, category);

	mkdirSync(categoryDir, { recursive: true });

	const fileName = `${functionName}.md`
	const filePathWithCategory = join(categoryDir, fileName);

	writeFileSync(filePathWithCategory, fileContents, { flag: 'w' });

	createdDocFiles.push(`${category}/${fileName}`);
});

if (createdDocFiles.length > 0) {
	console.log(ch.blue(ch.bold('Success:'), 'Function documentation generated:'));
	createdDocFiles.forEach(fileName => {
		console.log(ch.blue(`- ${fileName}`));
	});
}


if (undocumentedFileNames.length > 0) {
	console.log();
	console.warn(ch.yellow(ch.bold('Warning:'), 'The following files are not documented:'));
	undocumentedFileNames.forEach(fileName => {
		console.warn(ch.yellow(`- ${fileName}`));
	});
}