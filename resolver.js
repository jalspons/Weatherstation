import fetch                from 'node-fetch'
import { parseString }      from 'xml2js'
import { apiKey, baseUrl }  from '../reference.json'

const weatherUrl = (place) => `${baseUrl}/${apiKey}/wfs?request=getFeature&storedquery_id=fmi::observations::weather::daily::multipointcoverage&place=${place}&parameters=tday`
const xml2json   = async xml => new Promise((resolve, reject) => parseString(xml, (e, j) => e ? reject(e) : resolve(j)))

const data = x => {
  const root        = x['wfs:FeatureCollection']
  const timestamp   = root['$']['timeStamp']
  const result      = root['wfs:member'][0]['omso:GridSeriesObservation'][0]['om:result'][0]['gmlcov:MultiPointCoverage'][0]
  const temperature = result['gml:rangeSet'][0]['gml:DataBlock'][0]['gml:doubleOrNilReasonTupleList'][0]
    .trim()
    .split('\n')
    .map(x => x.trim())
  const date        = result['gml:domainSet'][0]['gmlcov:SimpleMultiPoint'][0]['gmlcov:positions'][0]
    .trim()
    .split('\n')
    .map(x => x.trim())
    .map(x => x.split(' '))
    .map(x => x[3])
  return {
    timestamp: timestamp,
    days     : temperature.map((x, i) => ({temperature: x, time: date[i]}))
  }
}

const weatherData = async (place) => await fetch(weatherUrl(place))
  .then(res => res.text())
  .then(x => xml2json(x))
  .then(x => data(x))

export const resolvers = {
  Query: {
    weather: (_, {place}) => weatherData(place)
  }
}