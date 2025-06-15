import { useState } from "react";
import styles from "./amino_acids.module.scss"

export default function aminoAcids () {
    const [acids, setAcids] = useState<{first: string; second: string}>({first: '', second: ''});

    const handleChange = (name: string, value: string) => {
      setAcids(prev => ({...prev, [name]: value}))
    }

}