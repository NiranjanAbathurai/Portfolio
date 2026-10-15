import { useState, useEffect } from "react"

interface EmptyState{
    message :string,
    icon?:string,
    onAction?: () => void,
    actionLabel?: string,
    items?: string[]
} 
export const EmptyState = ({ message, icon = "📦", onAction,actionLabel='Retry',items}: EmptyState) => {

    const [clickCount,setClickCount] = useState(0);
    const [filterText, setFilterText] = useState('');

    useEffect(()=>{
        console.log("EmptyState mounted");
        const handler = (e: KeyboardEvent) => {
            console.log("Key pressed:", e.key);
        };
        window.addEventListener('keydown',handler)
        return () => { 
            window.removeEventListener('keydown',handler);
            console.log("EmptyState unmounted")
        }
    },[])
    
    return (
        <>
        {/* 2 Rem example */}
        <div>
            <p style={{fontSize:'2rem'}}>{message}</p>
            <p style={{fontSize:'2rem'}}>{icon}</p>
        </div>
         {/* 1 Rem example */}
       <div>
            <p style={{fontSize:'1rem'}}>{message}</p>
            <p style={{fontSize:'1rem'}}>{icon}</p>
            {onAction && (<button onClick={onAction}>{actionLabel}</button>)}
            
        </div>
         {/* 1.5 Rem example */}
        <div>
            <p style={{fontSize:'1.5rem'}}>{message}</p>
            <p style={{fontSize:'1.5rem'}}>{icon}</p>
        </div>
        <p>{clickCount}</p>
        <button onClick={()=> setClickCount(prev => prev+1)}>Increment</button>

    {!items && 
    <p>No list to be displayed</p>}

    {items && (items?.length ==0 ? <p>No items available</p>:
        <ul>
             {items?.filter((data)=> data.includes(filterText))?.map((item,index) => {
                    return <li key={item}>{item}</li>
                })}
        </ul>)}
       
    <input value={filterText} onChange={e => setFilterText(e.target.value)} onKeyDown={e => e.key === 'Escape' && setFilterText('')} onFocus={e=> console.log("Search Focused")}></input>
        
        </>
        
    )
}