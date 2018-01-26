# Kitspace Gitlab Client

A client for GitLab that's specialised for Kitspace.

## Testing

```
docker-compose up -d
```
- ... wait till it's up
- go to http://localhost:8079/profile/personal_access_tokens, change root password and login as root
- create an access token with all scopes

```
cp .env.example .env
$EDITOR .env # and add the token
yarn test
```
