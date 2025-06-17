import { useState, FormEvent, useEffect } from "react";
import styles from './amino_acids.module.scss';


    const aminoPattern = /^[ARNDCEQGHILKMFPSTWYV-]+$/;
    const aaClassMap: Record<string, string> = {
      C: styles.cysteine,

      A: styles.hydrophobic,
      I: styles.hydrophobic,
      L: styles.hydrophobic,
      M: styles.hydrophobic,
      F: styles.hydrophobic,
      W: styles.hydrophobic,
      Y: styles.hydrophobic,
      V: styles.hydrophobic,
      P: styles.hydrophobic,
      
      G: styles.glycine,

      D: styles.negativeCharge,
      E: styles.negativeCharge,

      K: styles.positivecharge,
      R: styles.positivecharge,

      S: styles.polarCharged,
      T: styles.polarCharged,
      H: styles.polarCharged,
      Q: styles.polarCharged,
      N: styles.polarCharged
    }


export default function AminoAcids () {
    const [acids, setAcids] = useState<{first: string; second: string}>(
      {
        first: '', 
        second: ''
      });
    const [attempted, setAttempt] = useState<boolean>(false);
    const [touched, setTouched] = useState<{ first: boolean; second: boolean }>(
      {
        first: false,
        second: false,
      });
    const [toastVisible, setToastVisible] = useState(false);
    const [submittedAcids, setSubmittedAcids] = useState<{ first: string; second: string } | null>(null);



    const isSameLength = acids.first.length === acids.second.length;
    const needLiveCheck = !isSameLength && attempted;


    const isFirstInvalid = touched.first && acids.first !== '' && !aminoPattern.test(acids.first);
    const isSecondInvalid = touched.second && acids.second !== '' && !aminoPattern.test(acids.second);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const {name, value} = e.target;
      setSubmittedAcids(null)
      setAcids(prev => ({...prev, [name]: value}));
      setTouched(prev => ({ ...prev, [name]: true }));
    };
    
    const handleSelection = () => {
      const sel = window.getSelection()?.toString().trim();
      if (sel) {
        navigator.clipboard.writeText(sel);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 1000);
      } 
    }

    function onSubmit (e:FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setAttempt(true);
      

      if(isSameLength && !isFirstInvalid && !isSecondInvalid)
        {
          setSubmittedAcids(acids);
        }
    };

    useEffect(() => {
      if (attempted && isSameLength){
        setAttempt(false)
      }
    }, [attempted, isSameLength]);
    
    return (
          <form onSubmit={onSubmit} className={styles.form}>
                <label className={styles.field}>
                  Первая последовательность
                <input 
                type='text' 
                name = 'first' 
                value={acids.first} 
                onChange={handleChange}
                aria-invalid={isFirstInvalid}
                />
                { 
                isFirstInvalid && 
                (<span className={styles.errMsg}>Только A,R,N,D,C,E,Q,G,H,I,L,K,M,F,P,S,T,W,Y,V или “-”</span>) 
                }
                </label>

                <label className={styles.field}>
                  Вторая последовательность
                <input           
                type="text"
                name="second"
                value={acids.second}
                onChange={handleChange}
                aria-invalid={isSecondInvalid}
                />
                { isSecondInvalid && 
                (<span className={styles.errMsg}>Только A,R,N,D,C,E,Q,G,H,I,L,K,M,F,P,S,T,W,Y,V или “-”</span>) 
                }
                </label>

                <button 
                type="submit"
                disabled={
                  !acids.first ||
                  isFirstInvalid ||
                  isSecondInvalid ||
                  needLiveCheck
                }
                className={styles.button}
                >
                  Проверить кислоты</button>
                  { 
                  needLiveCheck
                  && <span className={styles.errMsg}>Длины последовательностей не совпадают</span>
                  }
                <div 
                  onMouseUp={handleSelection}
                >
                      {submittedAcids &&
                        <pre className={styles.alignment}>
                        { acids.first.split('').map((char, idx) => (
                          <span key={`first-${idx}`} className={aaClassMap[char] || ''}>
                            {char}
                          </span>
                        )) }
                        {'\n'}
                        {acids.second.split('').map((char, idx) => {
                          const isDiff = acids.first[idx] !== acids.second[idx];
                          const className =  isDiff ? aaClassMap[char] : '';
                          return (
                            <span key={`second-${idx}`} className={className}>
                              {char}
                            </span>
                          );
                        })}
                        </pre>
                      }
              </div>
              {toastVisible && (
                <div className={styles.toast}>
                  Скопировано в буфер!
                </div>
              )}
          </form> 
)
}