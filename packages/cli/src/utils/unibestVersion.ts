import axios from 'axios'
import * as base64 from 'js-base64'

interface GiteeFileResponse {
  content: string
  encoding: string
}

async function getUnibestVersion(): Promise<string | null> {
  try {
    const apiUrl = `https://gitee.com/api/v5/repos/feige996/unibest/contents/package.json`
    const response = await axios.get<GiteeFileResponse>(apiUrl, {
      params: {
        ref: 'main',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (response.status === 200) {
      const { content, encoding } = response.data
      if (encoding === 'base64') {
        const decodedContent = base64.decode(content)
        const packageJson = JSON.parse(decodedContent)
        return packageJson.version || null
      }
      else {
        // console.error(`Unsupported encoding: ${encoding}`);
        return null
      }
    }
    else {
      // console.error(`Request failed with status: ${response.status}`);
      return null
    }
  }
  catch (error) {
    // console.error(`An error occurred: ${error}`);
    return null
  }
}

export default getUnibestVersion
