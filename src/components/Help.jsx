import React from 'react'

const Help = props => (
  <div style={{ maxWidth: '50%', marginLeft: '20px', fontSize: 18 }}>
    <h3>Using the application</h3>
    <div>
      To upload a point set you can use a GeoJSON FeatureCollection of Point
      features or you can use a CSV. For a CSV you must include a 
      <br></br><br></br><code>lat,lng</code> <br></br><br></br>header on the first line followed by lines of the
      format <br></br><br></br><code>42.123, -87.3523</code>.<br></br><br></br> If you want to include properties
      for the points (like with GeoJSON) you must define the property names in
      the header. For example <br></br><br></br>
      <code>lat,lng,population,temperature</code> <br></br><br></br>followed by<br></br><br></br>
       <code>42.123, -87.3523, 109000, 75</code> <br></br><br></br>
    </div>
    <div>
      Once you have your point sets uploaded, you'll see them under "Point Sets"
      everytime you log in. You can then draw polygons around them and calculate
      metrics.
    </div>
  </div>
)

export default Help
