import React from "react";
import SelectedRoom from "../rooms/SelectedRoom";
import RoomList from "../rooms/RoomList";

const Main = () => {
    return <div className="flex h-screen">
        <RoomList />
        <SelectedRoom />
    </div>
}

export default Main;