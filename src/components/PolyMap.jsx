import React from 'react'
import {
  withGoogleMap,
  GoogleMap,
  Polygon,
  withScriptjs,
  Marker,
  KmlLayer,
} from 'react-google-maps'
import Button from '@material-ui/core/Button'
import { InfoBox } from 'react-google-maps/lib/components/addons/InfoBox'

export const PolyMap = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap
      defaultCenter={{ lat: 42, lng: -87 }}
      defaultZoom={5}
      onClick={props.handleMapClick}
    >
      {props.points.map(point => (
        <Marker
          position={{ lat: point.lat, lng: point.lng }}
          key={`${point.lat},${point.lng}`}
        />
      ))}
      {/*
        <InfoBox
          defaultPosition={new window.google.maps.LatLng(42, -87)}
          options={{ closeBoxURL: ``, enableEventPropagation: true }}
        >
          <div
            style={{
              backgroundColor: `#212121`,
              opacity: 0.75,
              padding: `12px`,
            }}
          >
            <div style={{ fontSize: `16px`, fontColor: `#212121` }}>
              {`Total population of ${props.metrics.num} markers in the polygon: ${props.metrics.sum}`}
            </div>
          </div>
        </InfoBox>
      */}
      <Polygon
        onClick={() => console.log('clicked polygon')}
        paths={[props.poly]}
        options={{
          strokeColor: '#fc1e0d',
          strokeOpacity: 1,
          strokeWeight: 2,
          icons: [
            {
              icon: 'hello',
              offset: '0',
              repeat: '10px',
            },
          ],
        }}
      />
    </GoogleMap>
  ))
)

export default PolyMap
