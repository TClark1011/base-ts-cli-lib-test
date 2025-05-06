# Lib

## Q+A

**Whats up with the weird `build` command?**
We first run `tsc --build --clean` which just deletes the previous build, then we run `tsc` to create a new build. Then in addition we use the `wait-on` command, which ensures the command is not considered complete until the new files actually exist. We do this because some parts of our CI need certainty that the build has actually been completed before moving on. By default (at least as I have observed) the `tsc` command completes a bit before the new files are actually written to disk.
