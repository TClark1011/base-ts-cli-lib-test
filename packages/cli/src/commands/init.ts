import { Command } from 'commander';

export const init = new Command()
	.name('init')
	.description('Initialize the project')
	.action(async () => {
		console.log('Initializing...');
	})