const fetch = require('node-fetch').default

const query = '\n    from(bucket: "system_usage")\n    |> range(start: -24h})\n    |> filter(fn: (r) => r._measurement == "storage_usage_org_cardinality"\n      and r._field == "gauge"\n      and r.org_id != "")\n    |> keep(columns: ["org_id", "_value"])\n    |> group(columns: ["org_id"], mode:"by")\n    |> last()\n'

exports.handler = async (event, context) => {
  try {
    const res = fetch(
        "https://us-west-2-1.aws.cloud2.influxdata.com/api/v2/query",
        {
            method:"POST",
            body:JSON.stringify({query})
        })

    console.log('res: ', res)

    return {
      statusCode: 200,
      body: JSON.stringify({ res })
    }

  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
