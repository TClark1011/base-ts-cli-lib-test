import { join } from 'path';
import { cwd } from 'process';
import { title } from 'radash';
import { Project, VariableStatement } from 'ts-morph';
import ch from 'chalk';
import { mkdirSync, writeFileSync } from 'fs';

const hasStringMessage = (val: unknown): val is Record<'message', string> =>
	typeof val === 'object' &&
	val !== null &&
	'message' in val &&
	typeof val.message === 'string';

export const extractErrorMessage = (
	errorObject: unknown,
	fallback?: string
): string => {
	if (typeof errorObject === 'string') return errorObject;

	if (hasStringMessage(errorObject)) return errorObject.message;

	if (fallback !== undefined) return fallback;

	// Last resort, if we are unable to reasonably derive
	// an error message from the object, we just stringify
	// the whole thing and return that
	return JSON.stringify(errorObject);
};

const getVariableStatementName = (variableStatement: VariableStatement): string => {
	const declaration = variableStatement.getDeclarations()[0];
	if (!declaration) throw new Error(`No declaration found`);

	return declaration.getName();
}


const LIB_PATH = join(cwd(), '../lib');


const project = new Project({
	tsConfigFilePath: join(LIB_PATH, 'tsconfig.json')
})



const functionFiles = project.getSourceFiles(join(LIB_PATH, 'src/*/*.ts'));


type FunctionFileListing = {
	category: string;
	functionName: string;
	description: string;
}

const undocumentedFileNames: string[] = [];

const listings: FunctionFileListing[] = functionFiles.map(sourceFile => {
	const fileName = sourceFile.getBaseName();
	const directoryName = sourceFile.getDirectory().getBaseName();

	try {
		const variableStatement = sourceFile.getVariableStatements()[0];
		if (!variableStatement) throw new Error(`No variable statement found`);

		const theJsDoc = variableStatement.getJsDocs()[0];
		if (!theJsDoc) throw new Error(`No JSDoc found`);

		const description = theJsDoc.getDescription().trim();


		return {
			category: directoryName,
			functionName: getVariableStatementName(variableStatement),
			description
		}

	} catch (err) {
		undocumentedFileNames.push(`${directoryName}/${fileName}`);
		return undefined
		// throw new Error(`[${directoryName}/${fileName}]: ${extractErrorMessage(err)}`);
	}
}).filter(val => !!val)


const createdDocFiles: string[] = [];

const OUTPUT_ROOT = join(cwd(), '../../function_docs_gen')
listings.forEach(({ category, functionName, description }) => {

	const fileContents = [
		`# ${functionName}`,
		description,
	].join('\n\n');

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