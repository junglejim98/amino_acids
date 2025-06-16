import { useState, FormEvent } from "react";

export default function AminoAcids () {
    const [acids, setAcids] = useState<{first: string; second: string}>({first: '', second: ''});
    const [attempted, setAttempt] = useState<boolean>(false);
    const isSameLength = acids.first.length === acids.second.length;
    const needLiveCheck = !isSameLength && attempted;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const {name, value} = e.target;
      setAcids(prev => ({...prev, [name]: value}))
    }
    
    function onSubmit (e:FormEvent<HTMLFormElement>) {
      e.preventDefault();
      if(!isSameLength)
        setAttempt(true);
    }

    
    return (
      <div>
          <form onSubmit={onSubmit}>
                <label>
                  Первая последовательность
                <input type='text' name = 'first' value={acids.first} onChange={handleChange}/>
                </label>
                <label>
                  Вторая последовательность
                <input type='text' name = 'second' value={acids.second} onChange={handleChange}/>
                </label>
                <button disabled={ !acids.first || needLiveCheck }>Проверить кислоты</button>
                  { !isSameLength && attempted && <p>Длины последовательностей не совпадают</p>}
          </form> 

          <div>

          </div>
     </div>
)
}