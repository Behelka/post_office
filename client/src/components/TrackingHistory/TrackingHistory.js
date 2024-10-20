import React, { useState } from "react";
import "./TrackingHistory.css"

const TrackingExample= () => {
    const [trackinginfo, setTrackingInfo]=useState([
    {TrackingID : 1234,Datetime : "2024-10-9  15:05", Location: "Arrive Houston", Status:"Shipping"},
    {TrackingID : 1234,Datetime : "2024-10-10  19:51", Location: "Left Houston", Status:"Shipping"},
    {TrackingID : 1234,Datetime : "2024-10-11  03:18", Location: "Arrive Austin", Status:"Out of dilivery"},
    {TrackingID : 1234,Datetime : "2024-10-12  11:30", Location: "Package delivered", Status:"Delivered"},
    {TrackingID : 5678,Datetime : "2020-11-01  07:42", Location: "Arrive Dallas", Status:"Shipping"},

  ]);

    const [trackingID,setTrackingID]=useState('');

    const [trackingResult,setTrackingResult]=useState(null);

    const [isFocused,setIsFocused]=useState(false);
    const handleFocus=()=>setIsFocused(true);
    const handleBlur=()=>setIsFocused(false);


    const handleSubmit=(e)=>{
        e.preventDefault();

        const result=trackinginfo.filter((item)=>item.TrackingID===Number(trackingID));

        if (result.length>0){
            setTrackingResult(result);

            setTrackingID('');
        }
        else {
            setTrackingResult([{error:'Tracking ID not found'}]);
            setTrackingID('');
        }

    };



    return(
        <div className="main_div">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={trackingID}
                     onChange={(e)=>setTrackingID(e.target.value)}
                     onFocus={handleFocus}
                     onBlur={handleBlur}
                     placeholder={!isFocused && trackingID===""?"Enter Tracking ID":""}
                     required
                />

                <button type="submit">Track</button>

            </form>

            {trackingResult && (
        <div>
          {trackingResult[0].error ? (
            <p>{trackingResult[0].error}</p>
          ) : (
            <table border="1" cellPadding="10" cellSpacing="0">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {trackingResult.map((item, index) => (
                  <tr key={index}>
                    <td>{item.Datetime}</td>
                    <td>{item.Location}</td>
                    <td>{item.Status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}


           
        </div>
    )

}





function TrackingHistory() {

    return(
        <div>
            <TrackingExample />
        </div>
    );
}

export default TrackingHistory;