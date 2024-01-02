"use client";

import {useEffect, useState} from "react";

function YearNumber() {
    const [year, setYear] = useState(new Date().getFullYear());
    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return year;
}

export default YearNumber;
