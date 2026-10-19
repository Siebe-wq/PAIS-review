// Admin saves go through putFile; it must not leak the token owner's identity.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GithubError, putFile } from '../src/lib/github.ts';

const config = { token: 't', repo: 'o/r', branch: 'main' };

test('commits are credited to a neutral identity', async () => {
  let sent;
  globalThis.fetch = async (_url, init) => {
    sent = JSON.parse(init.body);
    return new Response(JSON.stringify({ commit: { html_url: 'u' }, content: { sha: 's' } }), { status: 200 });
  };
  const result = await putFile(config, 'content/x.md', 'hi', 'message');
  assert.equal(sent.author.name, 'PAIS Review admin');
  assert.match(sent.author.email, /\.invalid$/);
  assert.deepEqual(sent.committer, sent.author);
  assert.equal(result.sha, 's');
});

test('a stale save is reported as a conflict, not a server fault', async () => {
  globalThis.fetch = async () => new Response('{"message":"does not match"}', { status: 409 });
  await assert.rejects(putFile(config, 'content/x.md', 'hi', 'm', 'old'), (e) => e instanceof GithubError && e.status === 409);
});
