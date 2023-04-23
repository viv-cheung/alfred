import { createAppAuth } from '@octokit/auth-app'
import { Octokit } from '@octokit/rest'
import { AlfredConfig } from '../types/AlfredConfig'

// Will create an octokit isntance based on Alfred's configuration
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

// Will create an issue in specified repository
export async function createIssue(
  octokit: Octokit, // Octokit instance for that specific app installation
  owner: string, // Owner of the repository
  repo: string, // Name of the repository
  title: string, // Issue title
  body: string, // Content of the issue
  labels?: string[], // Labels to assign to the issue
): Promise<string> {
  try {
    const resp = await octokit.issues.create({
      owner,
      repo,
      title,
      body,
      labels,
    })
    return resp.data.html_url
  } catch (error) {
    console.error('Error creating issue:', error)
    throw new Error(`Failed to create issue: ${error}`)
  }
}

// Will get the labels and their descriptions for a given repository
export async function getRepositoryLabels(
  octokit: Octokit, // Octokit instance for that specific app installation
  owner: string, // Owner of the repository
  repo: string, // Name of the repository
): Promise<string> {
  try {
    const response = await octokit.issues.listLabelsForRepo({
      owner,
      repo,
      per_page: 200,
    })
    const labels = response.data

    // Build a string with all labels
    let labelsString = ''
    labels.forEach((label) => {
      labelsString += `${label.name}: ${label.description} \n`
    })

    return labelsString
  } catch (error) {
    console.error("Error fetching repo's labels:", error)
    throw new Error(`Error fetching repo's labels: ${error}`)
  }
}
