/**
 * Agent Logger Hook
 *
 * This hook logs all tool calls made by agents during task execution.
 * It tracks:
 * - Tool name and parameters
 * - Execution time
 * - Results
 * - Files accessed/modified
 *
 * Usage: This hook automatically runs after each tool call
 */

interface ToolCallEvent {
  tool: string
  parameters: Record<string, unknown>
  result?: unknown
  timestamp: string
  duration?: number
}

export async function onToolCall(event: ToolCallEvent) {
  const logEntry = {
    timestamp: event.timestamp,
    tool: event.tool,
    parameters: event.parameters,
    duration: event.duration,
    success: !!event.result,
  }

  // Log to console with formatting
  console.log('\n📋 AGENT TOOL CALL')
  console.log('  Tool:', event.tool)
  console.log('  Timestamp:', event.timestamp)

  if (event.duration) {
    console.log('  Duration:', `${event.duration}ms`)
  }

  // Log parameters (truncate if too long)
  const params = JSON.stringify(event.parameters, null, 2)
  if (params.length > 200) {
    console.log('  Parameters:', params.substring(0, 200) + '...')
  } else {
    console.log('  Parameters:', params)
  }

  // Extract file paths from common tools
  const files = extractFiles(event.tool, event.parameters)
  if (files.length > 0) {
    console.log('  Files:', files.join(', '))
  }

  console.log('  Status:', event.result ? '✅ Success' : '❌ Failed')
  console.log('─'.repeat(60))

  // In a production system, this would send logs to the backend API
  // await fetch('http://localhost:3001/api/logs', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(logEntry),
  // })
}

function extractFiles(tool: string, parameters: Record<string, unknown>): string[] {
  const files: string[] = []

  // Extract file paths based on tool type
  switch (tool) {
    case 'Read':
    case 'Edit':
    case 'Write':
      if (parameters.file_path) {
        files.push(String(parameters.file_path))
      }
      break
    case 'Bash':
      // Extract files from bash commands (simplified)
      if (parameters.command) {
        const cmd = String(parameters.command)
        const fileRegex = /(?:cat|vim|nano|touch|rm|mv|cp)\s+([^\s]+)/g
        let match
        while ((match = fileRegex.exec(cmd)) !== null) {
          files.push(match[1])
        }
      }
      break
  }

  return files
}
