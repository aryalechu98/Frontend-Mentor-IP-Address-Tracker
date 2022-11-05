import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useState } from "react";
// https://geo.ipify.org/api/v2/country,city?apiKey=at_yi0U9ddUkD1c1BXALcLQF8EuoQeuE&ipAddress=8.8.8.8
import { MapContainer, TileLayer } from "react-leaflet";

import arrowIcon from "./images/icon-arrow.svg";
import background from "./images/pattern-bg.png";
import MarkerPosition from "./MarkerPosition";

function App() {
  const [address, setAddress] = useState(null);
  const [ipAddress, setIpAddress] = useState("");
  const checkIpAddress =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
  const checkDomain =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;
  useEffect(() => {
    try {
      const getInitialData = async () => {
        const res = await fetch(
          `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.REACT_APP_API_KEY}&ipAddress= 192.212.174.101`
        );
        const data = await res.json();
        setAddress(data);
        console.log(data);
      };
      getInitialData();
    } catch (err) {
      console.log(err.message);
    }
  }, []);

  const onInputChange=useCallback((e)=>{
    setIpAddress(e.target.value)
  },[])
  const getEnteredAddress = async () => {
    const res = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${
      process.env.REACT_APP_API_KEY
    }&${
      checkIpAddress.test(ipAddress)
        ? `ipAddress=${ipAddress}`
        : checkDomain.test(ipAddress)
        ? `domain=${ipAddress}`
        : ""
    }
  
  `);
  const data=await res.json();
  setAddress(data)
  console.log(data);

  };
  const handleSubmit = (e) =>{
    e.preventDefault();
    getEnteredAddress()
    setIpAddress('')
  }
  const onKeyDownHandler = (e) =>{
    if(e.keyCode === 13){
        e.preventDefault();
       getEnteredAddress()
       setIpAddress('')
    }
}
console.log('Address',address)
  return (
    <>
      <section>
        <div className="absolute -z-10">
          <img src={background} alt="" className="h-80 w-full object-cover" />
        </div>{" "}
        <article className="p-8">
          <h1 className="mb-8 text-center text-2xl font-bold text-white lg:text-3xl">
            IP Address Tracker{" "}
          </h1>{" "}
          <form onSubmit={handleSubmit}
          autoComplete='off'
          className="mx-auto flex max-w-xl justify-center">
            <input

              type="text"
              name="ipaddress"
              id="ipaddress"
              value={ipAddress}
              onKeyDown={onKeyDownHandler}
              placeholder="Search for any IP Address or domain"
              onChange={onInputChange}
              required
              className="w-full rounded-l-lg py-2 px-4"
            />
            <button
              type="submit"
              className="rounded-r-lg bg-black py-4 px-4 hover:opacity-80"
            >
              <img src={arrowIcon} alt="" />
            </button>{" "}
          </form>
        </article>{" "}
        {address && (
          <>
            <article
              className="relative mx-8 grid max-w-7xl grid-cols-1 gap-8 rounded-lg bg-white p-8 text-center shadow md:grid-cols-2 md:text-left lg:-mb-16 lg:grid-cols-4 xl:mx-auto"
              style={{
                zIndex: 1000,
              }}
            >
              <div className="lg:border-r-2 lg:border-slate-300">
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">
                  Ip Address
                </h2>
                <p className="text-lg font-semibold text-slate-900 md:text-xl xl:text-2xl">
                  {address.ip}
                </p>
              </div>
              <div className="lg:border-r-2 lg:border-slate-300">
                <h2 className="mb-3 text-ellipsis break-words text-sm font-bold uppercase tracking-wider text-slate-500">
                  Location{" "}
                </h2>{" "}
                <p className="text-lg font-semibold text-slate-900 md:text-xl xl:text-2xl">
                  {address.location.city},
                  <br />
                  {address.location.region}
                </p>{" "}
              </div>{" "}
              <div className="lg:border-r-2 lg:border-slate-300">
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">
                  Timezone{" "}
                </h2>{" "}
                <p className="text-lg font-semibold text-slate-900 md:text-xl xl:text-2xl">
                  UTC {address.location.timezone}
                </p>{" "}
              </div>{" "}
              <div>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">
                  ISP{" "}
                </h2>{" "}
                <p className="text-lg font-semibold text-slate-900 md:text-xl xl:text-2xl ">
                  {address.isp}
                </p>{" "}
              </div>{" "}
            </article>
            <MapContainer
              center={[address.location.lat, address.location.lng]}
              zoom={13}
              scrollWheelZoom={true}
              style={{
                height: "700px",
                width: "100vw",
              }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MarkerPosition address={address} />
            </MapContainer>{" "}
          </>
        )}{" "}
      </section>{" "}
    </>
  );
}

export default App;
