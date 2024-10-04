// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";

// const WaterReminder = () => {
//   const [showReminder, setShowReminder] = useState(false);
//   const location = useLocation();

//   useEffect(() => {
//     // Check if the current location matches the paths where you want the reminder
//     if (location.pathname === "/" || location.pathname === "/frhero") {
//       const interval = setInterval(() => {
//         console.log("Displaying water reminder."); // Log when reminder is about to show
//         setShowReminder(true);
//         setTimeout(() => {
//           setShowReminder(false);
//           console.log("Hiding water reminder."); // Log when reminder is hidden
//         }, 3000); // Hide after 3 seconds
//       }, 5 * 1000); // 5 seconds

//       return () => clearInterval(interval); // Clear interval on component unmount
//     }
//   }, [location.pathname]);

//   return (
//     <>
//       {showReminder && (
//         <div className="water-reminder">
//           <p>Time to drink water!</p>
//         </div>
//       )}
//     </>
//   );
// };

// export default WaterReminder;
