import { useCallback, useReducer, useState } from 'react'
export default function ClustersTable({clusters, activeClusterIndex, dataClusterIndex, onChange, onActiveChange}) {
  const [seq, increment] = useReducer((prev) => {return prev + 1}, 0)
  const addClusterHandler = useCallback(() => {
    if (typeof onChange === "function") {
      onChange([
        ...clusters,
        {
          id: seq,
          color: '#000'
        }
      ])
    }
    setFocus(seq)
    increment()
  }, [clusters, increment, onChange, seq])
  const [focus, setFocus] = useState()
  const onIdChange = useCallback(({target}, index) => {
    let cluster = clusters[index]
    setFocus(index)
    cluster.id = target.value
    if (typeof onChange === "function") {
      onChange([
        ...clusters.slice(0, index),
        cluster,
        ...clusters.slice(index + 1)
      ])
    }
  }, [clusters, setFocus, onChange])
  const onColorChange = useCallback(({target}, index) => {
    let cluster = clusters[index]
    cluster.color = target.value
    if (typeof onChange === "function") {
      onChange([
        ...clusters.slice(0, index),
        cluster,
        ...clusters.slice(index + 1)
      ])
    }
  }, [clusters, onChange])
  const deleteHandler = useCallback((index) => {
    if (window.confirm("Please confirm your delete request ?")) {
      onChange([
        ...clusters.slice(0, index),
        ...clusters.slice(index + 1)
      ])
    }
  }, [clusters, onChange])
  const activeChangeHandler = useCallback((index) => {
    if (typeof onActiveChange === "function") {
      onActiveChange(index)
    }
  }, [onActiveChange])
  return <table>
    <thead>
      <tr>
        <td></td>
        <td>Name</td>
        <td>Color</td>
        <td>Data points indices</td>
        <td></td>
      </tr>
    </thead>
    <tbody>
      {clusters?.length > 0 && clusters.map(({id, color}, index) => (
        <tr key={id}>
          <td><input checked={index === activeClusterIndex} type="radio" name="active" value={index} onChange={() => activeChangeHandler(index)}/></td>
          <td><input autoFocus={index === focus} type="text" value={id} onChange={e => onIdChange(e, index)} /></td>
          <td><input type="color" value={color} onChange={e => onColorChange(e, index)} /></td>
          <td>{Object.entries(dataClusterIndex).filter(([_, clusterIndex]) => clusterIndex === index).map(([i]) => i).join(",")}</td>
          <td style={{cursor: "pointer", color: 'red'}} onClick={() => deleteHandler(index)}>X</td>
        </tr>
      ))}
      <tr><td colSpan={4} style={{cursor: 'pointer'}} onClick={addClusterHandler}>Click to add more cluster</td></tr>
    </tbody>
  </table>
}