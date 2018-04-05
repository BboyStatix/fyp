import React, { Component } from 'react'

class Table extends Component {
  constructor(props){
    super(props)
    this.filterEntries = this.filterEntries.bind(this)
    this.downloadFile = this.downloadFile.bind(this)
    this.deleteFile = this.deleteFile.bind(this)
    this.state = { entries: [] }
  }

  componentWillReceiveProps(props) {
    this.setState({entries: props.entries})
  }

  filterEntries(entries) {
    const query = this.props.query
    var displayedEntries = query === '' ? entries : entries.filter((entry) => {
      const name = entry.name.toLowerCase()
      const date = entry.created_at.slice(0,10)
      switch (this.props.type) {
        case 'Diary':
          const description = entry.description === undefined ? '' : entry.description.toLowerCase()
          return name.indexOf(query) !== -1 || date.indexOf(query) !== -1 || description.indexOf(query) !== -1
        case 'Audio':
          const artist = entry.artist === undefined ? '' : entry.artist.toLowerCase()
          const album = entry.album === undefined ? '' : entry.album.toLowerCase()
          const information = entry.information === undefined ? '' : entry.information.toLowerCase()
          return name.indexOf(query) !== -1 || date.indexOf(query) !== -1 || artist.indexOf(query) !== -1 || album.indexOf(query) !== -1 || information.indexOf(query) !== -1
        default:
          return name.indexOf(query) !== -1 || date.indexOf(query) !== -1
      }
    })
    return displayedEntries
  }

  downloadFile(name, filename) {
    fetch('/download/file?jwt=' + localStorage.jwt + "&filename=" + filename)
    .then((res) => {
      return res.blob()
    })
    .then((blob) => {
      const FileSaver = require('file-saver')
      FileSaver.saveAs(blob, name)
    })
  }

  deleteFile(id, filename) {
    fetch('/delete/file', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jwt: localStorage.jwt,
        filename: filename
      })
    }).then((res) => {
        return res.json()
    }).then((json) => {
      const entries = this.state.entries.filter((entry) => {
        return !(entry._id === id)
      })
      this.setState({entries: entries})
    })
  }

  render() {
    const entries = this.filterEntries(this.state.entries)

    return (
      <div className="entry_container">
        <table className="table table-hover table-bordered">
          <thead>
            <Columns type={this.props.type}/>
          </thead>
          <tbody>
            {
              entries.map((entry, idx) =>
                <RowData key={idx} type={this.props.type} entry={entry} idx={idx} downloadFile={this.downloadFile} deleteFile={this.deleteFile}/>
              )
            }
          </tbody>
        </table>
      </div>
    )
  }
}

function RowData(props) {
  const type = props.type
  const entry = props.entry
  const idx = props.idx

  switch (type) {
    case 'Diary':
      return (
        <tr key={idx}>
          <td className="text-truncate">{entry.name}</td>
          <td className="text-truncate">{entry.description}</td>
          <td>{entry.eventType}</td>
          <td>{entry.fileType}</td>
          <td>{entry.created_at.slice(0,10)}</td>
          <td><button className="btn btn-outline-primary" onClick={() => props.downloadFile(entry.name, entry.filename)}>Download</button></td>
          <td><button className="btn btn-outline-danger" onClick={() => props.deleteFile(entry._id, entry.filename)}>Delete</button></td>
        </tr>
      )
    case 'Audio':
      return (
        <tr key={idx}>
          <td className="text-truncate" title={entry.name}>
            <a target='_blank' href={'http://www.google.com/search?q=' + entry.name.toLowerCase()}>
              {entry.name}
            </a>
          </td>
          <td className="text-truncate" title={entry.artist}>
            {
              entry.artist === undefined ?
              null
              :
              <a target='_blank' href={'http://www.google.com/search?q=' + entry.artist.toLowerCase()}>
                {entry.artist}
              </a>
            }
          </td>
          <td className="text-truncate" title={entry.album}>{entry.album}</td>
          <td className="text-truncate" title={entry.information}>{entry.information}</td>
          <td>{entry.usChartDate}</td>
          <td>{entry.usPeakNumOfWeeks}</td>
          <td>{entry.usPeakPosition}</td>
          <td>{entry.ukChartDate}</td>
          <td>{entry.ukPeakNumOfWeeks}</td>
          <td>{entry.ukPeakPosition}</td>
          <td>{entry.fileType}</td>
          <td>{entry.created_at.slice(0,10)}</td>
          <td><button className="btn btn-outline-primary" onClick={() => props.downloadFile(entry.name, entry.filename)}>Download</button></td>
          <td><button className="btn btn-outline-danger" onClick={() => props.deleteFile(entry._id, entry.filename)}>Delete</button></td>
        </tr>
      )
    case 'Photo':
      return (
        <tr key={idx}>
          <td className="text-truncate">{entry.name}</td>
          <td>{entry.resolution}</td>
          <td>{entry.fileType}</td>
          <td>{entry.created_at.slice(0,10)}</td>
          <td><button className="btn btn-outline-primary" onClick={() => props.downloadFile(entry.name, entry.filename)}>Download</button></td>
          <td><button className="btn btn-outline-danger" onClick={() => props.deleteFile(entry._id, entry.filename)}>Delete</button></td>
        </tr>
      )
    default:
      return (
        <tr key={idx}>
          <td className="text-truncate">{entry.name}</td>
          <td>{entry.fileType}</td>
          <td>{entry.created_at.slice(0,10)}</td>
          <td><button className="btn btn-outline-primary" onClick={() => props.downloadFile(entry.name, entry.filename)}>Download</button></td>
          <td><button className="btn btn-outline-danger" onClick={() => props.deleteFile(entry._id, entry.filename)}>Delete</button></td>
        </tr>
      )
  }
}

function Columns(props) {
  const type = props.type
  switch (type) {
    case 'Diary':
      return (
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Description</th>
          <th scope="col">Event</th>
          <th scope="col">Type</th>
          <th scope="col">Date</th>
          <th scope="col"></th>
          <th scope="col"></th>
        </tr>
      )
    case 'Audio':
      return (
        <tr>
          <th scope="col">Song</th>
          <th scope="col">Artist</th>
          <th scope="col">Album</th>
          <th scope="col">Information</th>
          <th scope="col">US chart date</th>
          <th scope="col">US Peak Position</th>
          <th scope="col">US no. of weeks</th>
          <th scope="col">UK chart date</th>
          <th scope="col">UK Peak Position</th>
          <th scope="col">UK no. of weeks</th>
          <th scope="col">Type</th>
          <th scope="col">Date</th>
          <th scope="col"></th>
          <th scope="col"></th>
        </tr>
      )
    case 'Photo':
      return (
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Resolution</th>
          <th scope="col">Type</th>
          <th scope="col">Date</th>
          <th scope="col"></th>
          <th scope="col"></th>
        </tr>
      )
    default:
      return (
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Type</th>
          <th scope="col">Date</th>
          <th scope="col"></th>
          <th scope="col"></th>
        </tr>
      )
  }
}

export default Table