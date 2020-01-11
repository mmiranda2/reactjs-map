import React from 'react'
import './App.css'
import Axios from 'axios'
import Button from '@material-ui/core/Button'
import PolyMap from './components/PolyMap'
import { connect } from 'react-redux'
import { Snack, InfoCard } from './components/shared'
import { logout, fetchSavedPolys, fetchSavedPointsets } from './actions'
import Sidebar from './components/Sidebar'
import DropMenu from './components/Menu'
import SimpleDialog from './components/SimpleDialog'
import { DropzoneDialog } from 'material-ui-dropzone'
import SignIn from './containers/SignIn'
import SignUp from './containers/SignUp'
import Help from './containers/Help'

const googleUrl = process.env.REACT_APP_GOOGLE_URL
class App extends React.Component {
  state = {
    poly: [],
    points: [],
    loadedPoly: false,
    polyJustSaved: false,
    polyFailedToSave: false,
    sidebarOpen: false,
    pointsInPoly: [],
    sumMetrics: 0,
    showMetrics: false,
    saveHitWhileLoggedOut: false,
    savedPolys: [],
    openSaveDialog: false,
    openUploadDialog: false,
    tab: 'map',
  }

  constructor(props) {
    super(props)
    this.handleMapClick = this.handleMapClick.bind(this)
    this.handleSaveClick = this.handleSaveClick.bind(this)
    this.handleClearMap = this.handleClearMap.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.handleLoadPoints = this.handleLoadPoints.bind(this)
    this.handleCalculate = this.handleCalculate.bind(this)
    this.handleClearPoints = this.handleClearPoints.bind(this)
    this.closeMetrics = this.closeMetrics.bind(this)
    this.showPoly = this.showPoly.bind(this)
    this.handleOpenSaveDialog = this.handleOpenSaveDialog.bind(this)
    this.handleUploadFile = this.handleUploadFile.bind(this)
  }

  componentDidMount() {}

  handleMapClick(e) {
    if (this.state.loadedPoly) {
      this.handleClearMap()
      this.setState({ loadedPoly: false })
    }
    this.setState({
      poly: [...this.state.poly, { lat: e.latLng.lat(), lng: e.latLng.lng() }],
    })
  }

  handleOpenSaveDialog() {
    if (this.props.user) {
      this.setState({ openSaveDialog: true })
    } else {
      this.setState({ saveHitWhileLoggedOut: true })
    }
  }

  handleSaveClick(e) {
    e.preventDefault()
    Axios.post('/api/data/save_polygon', {
      poly: [...this.state.poly],
      user: this.props.user,
      name: document.getElementById('name').value,
    })
      .then(({ data }) => {
        this.setState({ polyJustSaved: true, openSaveDialog: false })
        this.props.fetchSavedPolys(this.props.user)
      })
      .catch(e => {
        this.setState({ polyFailedToSave: true })
        console.log(e)
      })
  }

  handleLoadPoints() {
    Axios.get('/api/data/get_pointsets', { params: { email: '' } }).then(
      ({ data: { savedPointsets } }) => {
        const { pointset, uuid, name } = savedPointsets[0]
        this.setState({ points: pointset, pointUuid: uuid, pointName: name })
      }
    )
  }

  handleClearMap() {
    this.setState({ poly: [], showMetrics: false })
  }

  handleLogout() {
    this.handleClearMap()
    this.handleClearPoints()
    this.props.logout(this.props.user)
  }

  handleSidebar = open => event => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }
    this.setState({ ...this.state, sidebarOpen: open })
  }

  handleCalculate() {
    Axios.get('/api/data/get_metrics', {
      params: {
        poly: JSON.stringify(this.state.poly),
        uuid: this.state.pointUuid,
      },
    }).then(({ data: { pointsInPoly, sumMetrics } }) => {
      this.setState({ pointsInPoly, sumMetrics, showMetrics: true })
    })
  }

  handleClearPoints() {
    this.setState({ points: [], isMetrics: false })
  }

  handleUploadFile(fileArr) {
    const formData = new FormData()
    fileArr.forEach((file, i) => {
      formData.append(`${this.props.user}###${i}`, file, file.name)
    })
    Axios.post('/api/data/upload_points', formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      },
      timeout: 30000,
    })
      .then(({ data }) => {
        this.props.fetchSavedPointsets(this.props.user)
      })
      .catch(e => {
        console.log(e)
      })
    this.showUploadDialog(false)()
  }

  showUploadDialog = open => () => {
    if (this.props.user) {
      this.setState({ openUploadDialog: open })
    } else {
      this.setState({ saveHitWhileLoggedOut: true })
    }
  }

  goToPage = page => event => {
    this.setState({ ...this.state, tab: page })
  }

  closeMetrics() {
    this.setState({ showMetrics: false })
  }

  showPoly = i => () => {
    this.setState({ poly: this.props.savedPolys[i].poly, loadedPoly: true })
  }

  showPointset = i => () => {
    const { pointset, uuid, name } = this.props.savedPointsets[i]
    this.setState({
      points: pointset,
      pointUuid: uuid,
      pointName: name,
    })
  }

  handleBack = () => () => {
    this.handleSidebar(false)()
    this.setState({ tab: 'map' })
  }

  render() {
    return (
      <div>
        {this.state.tab === 'map' && (
          <div className="App">
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Sidebar
                handleSidebar={this.handleSidebar}
                sidebarOpen={this.state.sidebarOpen}
                goToPage={this.goToPage}
                user={this.props.user}
                logout={this.handleLogout}
                handleClearMap={this.handleClearMap}
              />
              <div
                style={{
                  display: 'flex',
                }}
              >
                <Button
                  onClick={() => {
                    this.handleClearMap()
                    this.handleClearPoints()
                  }}
                >
                  Clear Map
                </Button>
                <DropMenu
                  name={'Map Menu'}
                  items={[
                    { handler: this.handleClearMap, message: 'Clear Drawing' },
                    { handler: this.handleLoadPoints, message: 'Load Points' },
                    {
                      handler: this.handleClearPoints,
                      message: 'Clear Points',
                    },
                    {
                      handler: this.handleCalculate,
                      message: 'Number of Points in Poly',
                    },
                    {
                      handler: this.handleOpenSaveDialog,
                      message: 'Save Polygon',
                    },
                    {
                      handler: this.showUploadDialog(true),
                      message: 'Upload Point Set',
                    },
                  ]}
                  anchorEl={this}
                />
                {this.props.user && (
                  <div style={{ display: 'flex' }}>
                    <DropMenu
                      name={'Polygons'}
                      items={this.props.savedPolys.map((poly, i) => ({
                        handler: this.showPoly(i),
                        message: `${poly.name}`,
                      }))}
                      noneMessage={'Saved Polygons will show here'}
                      anchorEl={this}
                    />
                    <DropMenu
                      name={'Point Sets'}
                      items={this.props.savedPointsets.map((pointset, i) => ({
                        handler: this.showPointset(i),
                        message: `${pointset.name}`,
                      }))}
                      noneMessage={'Uploaded Point Sets will show here'}
                      anchorEl={this}
                    />
                  </div>
                )}
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: '5%',
                  right: '35%',
                  zIndex: 10,
                  visibility: !this.state.showMetrics && 'hidden',
                }}
              >
                <InfoCard
                  messages={Object.keys(this.state.sumMetrics).map(metric => ({
                    property: metric,
                    num: this.state.pointsInPoly.length,
                    sum: this.state.sumMetrics[metric],
                  }))}
                  closeMetrics={this.closeMetrics}
                />
              </div>
              <PolyMap
                containerElement={
                  <div style={{ height: '94vh', width: '100%' }} />
                }
                mapElement={<div style={{ height: `100%` }} />}
                googleMapURL={googleUrl}
                loadingElement={<div style={{ height: `100%` }} />}
                poly={[...this.state.poly]}
                points={[...this.state.points]}
                handleMapClick={this.handleMapClick}
              />
            </div>
            <SimpleDialog
              open={this.state.openSaveDialog}
              handleClose={() => this.setState({ openSaveDialog: false })}
              title={'Polygon'}
              body={'Choose a name for your saved polygon'}
              label={'Name'}
              handleSubmit={this.handleSaveClick}
            />
            <DropzoneDialog
              open={this.state.openUploadDialog}
              onSave={this.handleUploadFile}
              acceptedFiles={[
                'application/json',
                'application/geojson',
                '.csv',
                '.txt',
              ]}
              showPreviews={true}
              maxFileSize={5000000}
              onClose={this.showUploadDialog(false)}
            />
            <Snack
              open={this.state.polyJustSaved}
              onClose={() => this.setState({ polyJustSaved: false })}
              message={'Polygon successfully saved'}
            />
            <Snack
              open={this.state.polyFailedToSave}
              onClose={() => this.setState({ polyFailedToSave: false })}
              message={'Error in saving polygon'}
            />
            <Snack
              open={this.state.saveHitWhileLoggedOut}
              onClose={() => this.setState({ saveHitWhileLoggedOut: false })}
              message={'Please sign in to enable uploading and saving'}
            />
          </div>
        )}
        {this.state.tab === 'signin' && (
          <SignIn handleBack={this.handleBack()} />
        )}
        {this.state.tab === 'signup' && (
          <SignUp handleBack={this.handleBack()} />
        )}
        {this.state.tab === 'help' && <Help handleBack={this.handleBack()} />}
      </div>
    )
  }
}

export default connect(
  state => ({
    user: state.user,
    savedPolys: state.savedPolys,
    savedPointsets: state.savedPointsets,
  }),
  { logout, fetchSavedPolys, fetchSavedPointsets }
)(App)
