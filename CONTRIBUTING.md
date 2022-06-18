# How to Contribute

Smooth UI is a small project, it is widely used but has not a lot of contributors. We're still working out the kinks to make contributing to this project as easy and transparent as possible, but we're not quite there yet. Hopefully this document makes the process for contributing clear and answers some questions that you may have.

## [Code of Conduct](https://github.com/gregberge/react-teleporter/blob/main/CODE_OF_CONDUCT.md)

We expect project participants to adhere to our Code of Conduct. Please read [the full text](https://github.com/gregberge/react-teleporter/blob/main/CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

## Open Development

All work on Smooth UI happens directly on [GitHub](/). Both core team members and external contributors send pull requests which go through the same review process.

### Workflow and Pull Requests

_Before_ submitting a pull request, please make sure the following is done…

1.  Fork the repo and create your branch from `main`. A guide on how to fork a repository: https://help.github.com/articles/fork-a-repo/

    Open terminal (e.g. Terminal, iTerm, Git Bash or Git Shell) and type:

    ```sh-session
    $ git clone https://github.com/gregberge/react-teleporter
    $ cd react-teleporter
    $ git checkout -b my_branch
    ```

2.  Run `npm install`

3.  If you've added code that should be tested, add tests.

4.  If you've changed APIs, update the documentation.

5.  Ensure the linting is good via `npm run lint`.

    ```sh-session
    $ npm run lint
    ```

6.  Ensure the test suite passes via `npm run test`.

    ```sh-session
    $ npm run test
    ```

## Bugs

### Where to Find Known Issues

We will be using GitHub Issues for our public bugs. We will keep a close eye on this and try to make it clear when we have an internal fix in progress. Before filing a new issue, try to make sure your problem doesn't already exist.

### Reporting New Issues

The best way to get your bug fixed is to provide a reduced test case. Please provide a public repository with a runnable example.

## License

By contributing to this project, you agree that your contributions will be licensed under its MIT license.
