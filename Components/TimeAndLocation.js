import React from "react";

const TimeAndLocation = ({
  weather: { formattedLocalTime, name, country },
}) => {
  return (
    <div>
      <div className="flex my-6 item-center justify-center">
        <p className="text-xl font-extralight">{formattedLocalTime}</p>
      </div>
      <div className="flex my-6 item-center justify-center">
        <p className="text-3xl font-medium">{`${name},${country}`}</p>
      </div>
    </div>
  );
};

export default TimeAndLocation;
