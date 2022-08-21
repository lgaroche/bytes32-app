import { Spinner } from "grommet";
import React, { useCallback, useEffect, useState } from "react";
import Entry from "./Entry";
import { SolrEntry } from "../pages/api/solr";
import Toolbar from "./Toolbar";

const Feed = () => {
  const [entries, setEntries] = useState<SolrEntry[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [refresh, setRefresh] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    fetch("/api/solr")
      .then(async r => {
        if (r.status !== 200) {
          throw new Error("bad response")
        }
        setEntries(await r.json())
        setLoading(false)
      })
      .catch(e => {
        console.error(e)
      })
  }, [refresh])

  const doRefresh = useCallback(() => {
    setRefresh(r => !r)
  }, [refresh])

  return (
    <>
      <Toolbar refresh={doRefresh} />
      {
        entries ? entries.map(entry => (
          <Entry
            key={entry.id}
            date={new Date(entry["block.time"])}
            author={entry.signer}
            content={entry["content.text"]}
          />
        )) :
          <>
            {
              loading ?
                <Spinner />
                :
                <React.Fragment />
            }
          </>
      }
    </>
  )
}

export default Feed