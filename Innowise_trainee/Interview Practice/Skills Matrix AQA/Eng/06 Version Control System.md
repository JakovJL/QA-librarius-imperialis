# Version Control System

## Table of Contents

- [[#Matrix Scope]]
- [[#Questions and Answers]]
	- [[#What Is a Version Control System and Why Is It Needed?]]
	- [[#How Do You Start and Publish Work With Git?]]
	- [[#How Can You Move Changes Between Branches?]]
	- [[#What Is the Difference Between Reset, Revert, and Restore?]]
	- [[#How Do You Inspect History and Work With Pull Requests?]]
	- [[#What Are .gitignore, Submodules, and Git Hooks?]]
	- [[#How Do You Recover, Rebase, and Work With Other Version Control Systems?]]
- [[#Theory Links]]

**Related notes:** [[00 Skills Matrix AQA Index]]

---

## Matrix Scope

This note covers:

- Git basics, configuration, clone, pull, push, commit, and branches.
- Moving changes with merge, rebase, cherry-pick, and stash.
- Reset, revert, history, pull requests, ignore rules, submodules, and hooks.
- Basic awareness of SVN and TFS or Azure DevOps.

---

## Questions and Answers

### What Is a Version Control System and Why Is It Needed?

**Short answer:**

A Version Control System records file changes, supports collaboration, preserves history, and lets a team restore or compare versions. Git is distributed: every clone has local history. SVN and classic TFS are commonly used in a centralised model.

### How Do You Start and Publish Work With Git?

**Short answer:**

I set my identity with `git config`, clone the repository, create a branch, edit files, inspect `git status` and `git diff`, stage changes, and commit them. I synchronise with the remote using `git pull` or fetch plus rebase, then publish the branch with `git push -u origin <branch>`.

### How Can You Move Changes Between Branches?

**Short answer:**

I can merge a branch to preserve both histories, rebase my commits onto a new base for a linear history, or cherry-pick selected commits. For unfinished local work, I can use `git stash`, switch branches, and later apply the stash. The correct method depends on team policy and whether commits are already shared.

### What Is the Difference Between Reset, Revert, and Restore?

**Short answer:**

`git reset` moves a branch pointer and can unstage or discard local work. `git revert` creates a new commit that reverses an old commit, so it is safer for shared history. `git restore` restores file content or unstages files. `reset --hard` can destroy uncommitted changes, so I verify status and create a backup before using it.

### How Do You Inspect History and Work With Pull Requests?

**Short answer:**

I use `git log`, `git show`, `git diff`, and `git blame` when appropriate. In a Pull Request, I explain the change, link the task, check CI, respond to review comments, and merge using the project's strategy. I do not rewrite a shared branch without agreement.

### What Are .gitignore, Submodules, and Git Hooks?

**Short answer:**

`.gitignore` excludes untracked generated or local files, but it does not remove an already tracked file. A submodule stores a reference to another repository and must be initialised and updated explicitly. Git hooks run scripts on events such as commit or push; client-side hooks help locally, while server or CI checks give stronger team-wide enforcement.

**Submodule workflow:**

- Add one with `git submodule add <repository-url> <path>`.
- Clone it with the main project using `git clone --recurse-submodules`, or initialise it later with `git submodule update --init --recursive`.
- Update it with `git submodule update --remote` when the project policy allows it.
- Remove it by deinitialising it, removing the working directory and `.gitmodules` entry, then committing the changed gitlink. This must be reviewed carefully because it changes a tracked dependency.

### How Do You Recover, Rebase, and Work With Other Version Control Systems?

**Replace local work with the remote branch:**

First check that no required local work is uncommitted. Then run `git fetch origin` and `git reset --hard origin/<branch>`. `fetch` updates remote-tracking information; `reset --hard` makes the current branch, index, and working tree match that remote commit. It destroys local changes.

**Rebase:**

`git rebase <upstream>` replays the current branch commits on top of a new base. During a conflict, resolve files, run `git add <file>`, and continue with `git rebase --continue`. Use `git rebase --abort` to return to the branch state before the rebase. Do not rebase already shared history unless the team agrees.

**SVN and TFS/Azure DevOps:**

SVN is usually centralised: `svn checkout` or `svn co` creates a working copy, and `svn update` or `svn up` receives server changes. In SVN, a merge applies changes between branches and `svn revert` discards local uncommitted changes. TFVC in classic TFS also uses a central server; Azure DevOps can host either TFVC or Git. The exact merge and rollback procedure depends on the chosen repository type and project policy.

---

## Theory Links

- [[18 Git and Version Control]]
