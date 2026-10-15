import { EmptyState } from './EmptyState'
import { useRef, useMemo, useState } from 'react'
import { useForm} from 'react-hook-form';

type ContactForm = {
  name:string;
  email:string;
  message:string;
}

export const App = () => {

  const products = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Mango', 'Orange', 'Pineapple', 'Strawberry', 'Watermelon'];
  const [filterText,setFilterText] = useState('');
  const filteredProducts = useMemo(()=>{
   const filteredList = products.filter((item)=> item.includes(filterText))
   console.log("Filtering...",filteredList)
   return filteredList;
  },[filterText])


  const inputElement = useRef<HTMLInputElement>(null);
  const onClickMethod = () => {
    inputElement.current?.focus()
  }

  const contactForm = useForm<ContactForm>({
    defaultValues:{
      name:'',
      email:'',
      message:''
    }
  })

  const onSubmit = (data:ContactForm) => {
    alert(JSON.stringify(data))
  }

  return (
    
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#1db954', marginBottom: '20px' }}>React Playground</h1>
      <p style={{ color: '#888', marginBottom: '20px' }}>Open DevTools (F12) → Console tab to see useEffect logs.</p>

      <hr style={{ borderColor: '#333', margin: '20px 0' }} />

      {/* EmptyState with items */}
      <h2 style={{ fontSize: '1rem', color: '#ccc' }}>EmptyState with items:</h2>
      <EmptyState
        message="Your inventory"
        icon="🏠"
        items={['Rice', 'Milk', 'Bread', 'Eggs', 'Butter']}
        onAction={() => alert('Retry clicked!')}
        actionLabel="Refresh"
      />

      <hr style={{ borderColor: '#333', margin: '20px 0' }} />

      {/* EmptyState with empty items */}
      <h2 style={{ fontSize: '1rem', color: '#ccc' }}>EmptyState with empty items:</h2>
      <EmptyState
        message="Nothing here"
        items={[]}
      />

      <hr style={{ borderColor: '#333', margin: '20px 0' }} />

      {/* EmptyState without items */}
      <h2 style={{ fontSize: '1rem', color: '#ccc' }}>EmptyState without items:</h2>
      <EmptyState
        message="No data provided"
      />
      <input ref={inputElement} type='text'></input>
      <button onClick={onClickMethod}>Focus</button>

      <input value={filterText} type='text' onChange={(e)=>setFilterText(e.target.value)}></input>
      {filteredProducts.length === 0 ? (<p>No data found</p>):
      (<ul>
        {filteredProducts.map((data)=>{
          return <li key={data}>{data}</li>
        })}
      </ul>)
      }

      <form onSubmit={contactForm.handleSubmit(onSubmit)}>
        <label>Name</label>
        <input {...contactForm.register('name',{required:'Name is required'})}></input>
        {contactForm.formState.errors.name?.message && <p>{contactForm.formState.errors.name.message}</p>}
        <label>Email</label>
        <input {...contactForm.register('email',{required:'Email is required',pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' }})}></input>
          {contactForm.formState.errors.email?.message && <p>{contactForm.formState.errors.email.message}</p>}
        <label>Message</label>
        <input {...contactForm.register('message',{required:'Message is required', minLength: { value: 10, message: 'At least 10 characters' }})}></input>
          {contactForm.formState.errors.message?.message && <p>{contactForm.formState.errors.message.message}</p>}
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}
