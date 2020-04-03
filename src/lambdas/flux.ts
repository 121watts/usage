import fetch from 'node-fetch'
import {APIGatewayEvent, Context} from 'aws-lambda'

const query = `
      from(bucket: "system_usage")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "storage_usage_org_cardinality" and r._field == "gauge" and r.org_id != "")
        |> keep(columns: ["org_id", "_value"])
        |> group(columns: ["org_id"], mode:"by")
        |> last()
        `

exports.handler = async (event: APIGatewayEvent, context: Context) => {
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

    console.log('payload', payload)

    const res = await fetch(url, payload)

    if (!res.ok) {
      throw new Error('problem with request')
    }
    const data = await res.text()

    return {
      statusCode: 200,
      body: JSON.stringify({ data })
    }

  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
