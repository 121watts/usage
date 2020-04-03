const fetch = require('node-fetch').default

const query = `
      from(bucket: "system_usage")
        |> range(start: -24h)
        |> filter(fn: (r) => r._measurement == "storage_usage_org_cardinality" and r._field == "gauge" and r.org_id != "")
        |> keep(columns: ["org_id", "_value"])
        |> group(columns: ["org_id"], mode:"by")
        |> last()
        `

console.log('process.env', process.env)

exports.handler = async (event, context) => {
  try {
    const res = await fetch(
        "https://us-west-2-1.aws.cloud2.influxdata.com/api/v2/query?orgID=03b603ab272a3000",
        {
            method:"POST",
            body:JSON.stringify({query}),
            headers: {
              'Authorization': `Token ${process.env.INFLUX_TOKEN}`,
            }
        })

    const data = await res.json()
    console.log('res: ', data)

    return {
      statusCode: 200,
      body: JSON.stringify({ data })
    }

  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
