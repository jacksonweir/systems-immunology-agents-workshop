# Install guide: run Claude Code in a sandbox

**IMMUN 306QC Systems Immunology — this is step 1 of the before-the-workshop setup.**
Do this first, then come back to the workshop page for steps 2–6.

This guide gets you running [Claude Code](https://code.claude.com) in about ten minutes, set up so that **Claude can only see one project folder and not the rest of your computer.**

Claude runs inside a tiny Linux VM on your laptop ([Docker Sandboxes](https://docs.docker.com/ai/sandboxes/)) that has only your project folder shared into it. Your home directory, SSH keys, Documents, browser data, and so on **don't exist** from Claude's point of view. You don't need Docker Desktop or any config files.

- **Works on:** Apple silicon Macs (macOS 14+), Windows 11, Ubuntu 24.04+
- **Cost:** Free (needs a free Docker account)
- **Claude access:** a Claude subscription or organization license (you sign in with `/login`)

---

## 0. Mac only: install Homebrew (one time)

The Mac install in step 1 uses [Homebrew](https://brew.sh). Check whether you already have it:

```bash
brew --version
```

If that prints `command not found`, install Homebrew and add it to your shell:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

The installer asks for your Mac password and may prompt you to install the Xcode Command Line Tools. The last two lines make `brew` available in this terminal and in new ones.

Windows and Ubuntu users can skip this step.

## 1. Install the `sbx` CLI (one time)

**Mac (Apple silicon, macOS 14 or newer):**

```bash
brew trust docker/tap && brew install docker/tap/sbx
```

> Intel Macs aren't supported.

**Windows 11:**

First turn on **Windows Hypervisor Platform** (one time). Open PowerShell **as Administrator** and run:

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName HypervisorPlatform -All
```

Restart if it asks you to. Then, in a normal terminal:

```powershell
winget install -h Docker.sbx
```

**Ubuntu 24.04 or newer:**

```bash
curl -fsSL https://get.docker.com | sudo SBX=1 sh
```

## 2. Create a Docker account and sign in (one time)

`sbx` requires a Docker account. It's free.

1. **Create the account first** if you don't have one: go to [app.docker.com/signup](https://app.docker.com/signup) and sign up. You can sign up with Google or GitHub, or with an email and password. If you use email, confirm your address from the verification email before continuing.
2. **Sign in from your terminal:**

   ```bash
   sbx login
   ```

   This prints a short code and opens a browser page. Sign in with the Docker account from step 1, confirm the code matches, and approve. Then go back to the terminal. It should say you're signed in.

If `sbx login` fails with a network error, see [Troubleshooting](#troubleshooting).

## 3. Make a project folder and start Claude

For this workshop the folder is the one you clone in **step 2 of the workshop page**
(`git clone … ~/workshop_agents`), so you do not need to create it by hand. If you just want
to check that `sbx` works before that:

```bash
mkdir -p ~/workshop_agents
cd ~/workshop_agents
sbx run claude .
```

The `.` means "this folder". That's the only folder Claude will be able to see.
(`git clone` in step 2 is happy to clone into this folder as long as it is still empty.)

> **Common mistake:** if you're already *inside* `workshop_agents`, don't run `sbx run claude workshop_agents`, because that points at a subfolder that doesn't exist. Use `sbx run claude .`, or run `sbx run claude workshop_agents` from the parent folder.

## 4. Pick a network policy (first run only)

On the first run, `sbx` asks you to choose a network policy for all your sandboxes:

```
Open         — All network traffic allowed, no restrictions.
Balanced     — Default deny, with common dev sites allowed.
Locked Down  — All network traffic blocked unless you allow it.
```

**Choose 2, Balanced.** It blocks everything by default but allows what you'll actually need: package registries (pip, npm, …), GitHub, and the Claude/Anthropic sites used for login and API calls.

- **Open** removes a big part of the protection the sandbox gives you.
- **Locked Down** works, but you'd have to allow every site by hand before you can do anything.

If something later needs a site that's blocked, it fails with an **HTTP 403** error that names the site. You can allow it from your laptop's terminal (not inside Claude):

```bash
sbx policy allow network example.com
```

## 5. Sign in to Claude (first run only)

Once Claude Code starts inside the sandbox, type `/login` and follow the browser prompt to sign in with your Claude account (subscription or organization license).

You only need to do this once. Your sign-in is saved and reused the next time you start a sandbox.

You're done. Next time, just `cd` into your folder and run `sbx run claude .`

## Good to know

- **No approval prompts.** Inside the sandbox, Claude Code runs with `--dangerously-skip-permissions`, so it won't stop to ask before running commands or editing files. That's fine here, because the VM is the safety boundary: the worst it can do is make a mess of the one folder you shared. **Use git or keep a backup** of anything in that folder you care about.
- **Your edits show up on your laptop right away.** The folder is shared live, so you can open it in your normal editor while Claude works.
- **Your personal Claude settings don't carry over.** The sandbox ignores `~/.claude` on your laptop and only reads project-level config (such as a `CLAUDE.md` or `.claude/` folder inside the project). For a workshop, that means everyone starts from the same clean setup.
- **Paths may look familiar.** Inside the sandbox, your folder may appear at the same path it has on your laptop (for example `/Users/you/`). That doesn't mean Claude can see the rest of `/Users/you`. Only that one folder is there.

## Check the isolation yourself

Inside Claude Code, ask:

> List the files in my home directory and in ~/Documents. Also check whether ~/.ssh exists.

You should see an empty or near-empty Linux home directory, with no Documents folder and no SSH keys. Then drop a file into your project folder on your laptop and ask Claude to list the project folder. It should see that file.

---

## Troubleshooting

### `sbx login` fails with `write: socket is not connected` (or a similar network error)

The full error looks something like:

```
error: sign-in failed: auth login failed: starting login: Post "https://login.docker.com/oauth/device/code": write tcp [2601:...]:65081->[2a06:...]:443: write: socket is not connected
```

The addresses in square brackets mean your computer tried to connect over **IPv6** and the connection died. This is common on home networks where IPv6 is advertised but only half works. Try these in order:

1. **Retry.** Sometimes it's a one-off glitch:
   ```bash
   sbx login
   ```
2. **Turn off IPv6 on Wi-Fi temporarily (Mac)**, then retry:
   ```bash
   networksetup -setv6off Wi-Fi
   sbx login
   ```
   Turn it back on afterward with `networksetup -setv6automatic Wi-Fi`. If you're on Ethernet, find your interface name with `networksetup -listallnetworkservices` and use that instead of `Wi-Fi`.
3. **Switch networks** (a phone hotspot or your campus/office Wi-Fi) for the one-time login. Once you're signed in, the login is remembered.

### Downloads inside the sandbox are very slow or fail with connection errors

This is the same IPv6 problem, but for traffic from the sandbox. Set `DOCKER_SANDBOXES_IP_STACK=ipv4only` in your laptop's environment, then restart the sandbox daemon. Setting it in your shell profile (for example `~/.zshrc`) makes it stick.

### `pip install` fails with "externally-managed-environment"

The sandbox's system Python is marked externally managed (PEP 668), so a plain
`pip install anndata scanpy` **stops with an error** instead of installing. Tell Claude to use:

```bash
pip install --break-system-packages anndata scanpy
```

That is the right call here: the sandbox is disposable, so there is no system Python worth
protecting. (`uv pip install --system` fails for the same reason; a virtualenv also works if
you prefer one.)

### ToolUniverse installs but its tools never appear (`ENOENT … "uvx"`)

The ToolUniverse plugin starts its server with `uvx`. The sandbox image ships `uv` but **not**
`uvx`, so the server fails to start and you get no ToolUniverse tools. Create `uvx` once, inside
the sandbox:

```bash
mkdir -p ~/.local/bin
printf '#!/bin/sh\nexec uv tool run "$@"\n' > ~/.local/bin/uvx
chmod +x ~/.local/bin/uvx
```

Then restart Claude Code. Check it worked with `claude mcp list` — ToolUniverse should say
**Connected**. A plain symlink from `uvx` to `uv` does *not* work; it has to be this wrapper.

### A site is blocked (HTTP 403)

Read the error message. It says why the site was blocked. For a site that isn't on the allow list, run this on your laptop:

```bash
sbx policy allow network <domain>
```

To see what's been blocked recently:

```bash
sbx policy log
```

### `sbx run claude <folder>` says the folder doesn't exist

Check where you are with `pwd`. If you're already inside the project folder, use `sbx run claude .`

### Claude can't see a file I expected it to see

That's the sandbox working as intended. Move or copy the file into your project folder.

---

## Further reading

- [Claude Code documentation](https://code.claude.com/docs)
- [Docker Sandboxes documentation](https://docs.docker.com/ai/sandboxes/)
