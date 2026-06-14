import "dotenv/config";

const getOpenAIAPITResponse=async(message)=>{
    const options={
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.AZURE_OPENAI_API_KEY,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: message
            }
          ]
        })
    }
  try {
    const response = await fetch(
      `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${process.env.AZURE_OPENAI_API_VERSION}`,
      options
    );

    const data = await response.json();

    //console.log(data.choices[0].message.content);

    return data.choices[0].message.content;
  } catch (err) {
    console.error(err);
  }
}

export default getOpenAIAPITResponse;