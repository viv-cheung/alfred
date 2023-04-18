import { createAppAuth } from '@octokit/auth-app'
import { Octokit } from '@octokit/rest'
import { AlfredConfig } from 'src/types/AlfredConfig'

export async function getOctokit(config: AlfredConfig): Promise<Octokit> {
  // Deconstruct config
  const { installationId, ...options } = config

  // Get auth for app
  const auth = createAppAuth(options)

  // Retrieve installation access token
  const installationAuthentication = await auth({
    type: 'installation',
    installationId,
  })

  // Return ocktokit for specific app installation
  return new Octokit({
    auth: installationAuthentication.token,
  })
}

export async function createIssue(
  octokit: Octokit, // Octokit instance for that specific app installation
  owner: string, // Owner of the repository
  repo: string, // Name of the repository
  title: string, // Issue title
  body: string, // Content of the issue
  // labels?: string[], // Labels to assign to the issue
): Promise<string> {
  try {
    const resp = await octokit.issues.create({
      owner,
      repo,
      title,
      body,
    })
    return resp.data.html_url
  } catch (error) {
    console.error('Error creating issue:', error)
    return `Failed to create issue: ${error}`
  }

  // Labels ??
}
