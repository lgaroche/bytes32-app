import { Spinner } from "grommet";
import React, { useEffect, useState } from "react";
import Entry from "./Entry";
import { SolrEntry } from "../pages/api/solr";

const Feed = () => {
  const [entries, setEntries] = useState<SolrEntry[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    fetch("/api/hello")
      .then(r => r.json())
      .then(data => {
        console.log(data)
        setEntries(data)
        setLoading(false)
      })
  }, [])
  return (
    <>
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