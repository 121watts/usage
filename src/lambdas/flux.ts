import fetch from 'node-fetch'
import {APIGatewayEvent, Context} from 'aws-lambda'

exports.handler = async (event: APIGatewayEvent, context: Context) => {
  let body = {query: ''}
  if (event.body) {
    body = JSON.parse(event.body)
  }

  const {query} = body

  try {
    const payload = {
            method:"POST",
            body: JSON.stringify({query}),
            headers: {
              'Authorization': `Token ${process.env.INFLUX_TOKEN}`,
              'Content-Type': 'application/json'
            }
        }

    const url = "https://us-west-2-1.aws.cloud2.influxdata.com/api/v2/query?orgID=03b603ab272a3000"
    const res = await fetch(url, payload)

    if (!res.ok) {
      throw new Error('problem with request')
    }

    const data = await res.text()

    return {
      statusCode: 200,
      body: JSON.stringify({ data, whatYouSent: body })
    }

  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
