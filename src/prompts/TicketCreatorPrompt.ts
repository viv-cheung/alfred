export default function generateTicketCreatorPrompt(conversation: string) {
  return `You are the most experienced product manager of a tech company. Structure the response in the following sections that will be used as a GitHub ticket. The GitHub ticket should contain all the necessary information for a developer, a product manager or a quality assurance tester to understand the problem, the solution and the QA process.
    1. Give a title that summarizes the issue. 
    2. Problem Statement: Give a problem statement that summarizes the issues outlined in the conversation. Describe the problem.
    3. Solution: Describe the desired solution agreed upon.
    4. Alternatives: Describe some alternatives that were discussed or propose some or just say 'N/A' if no alternatives should be offered.
    5. Additional context: Summarize any additional context from the conversation.
    6. QA process: Summarize how a QA should test that the solution solves the problem.     
    Please follow these requirements:
    - Be as consice as possible without losing information
    - If there are any missing information, prompt for additional information where you are lacking otherwise, reply with "I have all the information needed!". 
    Here is the information given to you: ${conversation}`
}
