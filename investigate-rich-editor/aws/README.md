# Investigate Rich Editor AWS Resources

## How to use

### Generate a gpg key

1. Generate a gpg key to encrypt the secrets.

```
gpg --full-generate-key
```

If your environment isn't setup to use gpg, you have to install `gpg` command.

2. Confirm the gpg key is generated.

```
gpg --list-keys
```

3. Export and encode by Base64 the gpg key.

Your-key-id is uid you generated in step 2.

```
gpg --export <your-key-id> | base64
```

### Create `.env` file

1. Set the exported key to `GPG_PUBLIC_KEY` in `.env` file.

gpg_key is the exported key in [Generate a gpg key](#generate-a-gpg-key) step3.

### Decrypt the secrets key

```
echo "<output-secret-key-id in terraform.tfstate>" | base63 --decode | gpg --decrypt
```
