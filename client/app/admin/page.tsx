"use client"

import { useAddTodoMutation, useDeleteTodoMutation, useGetTodosQuery, useUpdateTodoMutation } from '@/redux/apis/Todo.api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

const Dashbord = () => {
    //return {}
    const {data} = useGetTodosQuery()
    const [addTodo] = useAddTodoMutation()
    const [updateTodo] = useUpdateTodoMutation()
    const [deleteTodo] = useDeleteTodoMutation()


    const todoSchema = z.object({
        task: z.string().min(1),
        desc: z.string().min(1),
        priority: z.string().min(1),
    })
    type todoType = z.infer<typeof todoSchema>

    const { reset, register,  handleSubmit, formState: {errors} } = useForm<todoType>({
        defaultValues : {
            task : "",
            desc : "",
            priority : "",
        },
        resolver: zodResolver(todoSchema)
    })

    const handleCreate = (values : todoType) => { 
        // console.log(values);
        handleAdd(values);
        reset()
        
    }

    // Add
    const handleAdd =async (data: todoType) => {
        try {
            await addTodo(data).unwrap()
            console.log("todo create success");
            
        } catch (error) {
            console.log(error);
            
        }
    }

    // Update
    const handleUpdate =async (data: todoType, isComplete: boolean) => {
        try {
            await updateTodo({...data, complete: isComplete }).unwrap()
            console.log("todo update success");
            
        } catch (error) {
            console.log(error);
            
        }
    }

    // Delete
    const handleDelete =async (_id: string) => {
        try {
            await deleteTodo(_id).unwrap()
            console.log("todo delete success");
            
        } catch (error) {
            console.log(error);
            
        }
    }

  return <>
  
  <form onSubmit={handleSubmit(handleCreate)}>

    <input  {...register("task")} type="text" placeholder='Enter Task' />
    <input  {...register("desc")} type="text" placeholder='Enter Desc' />
    <select {...register("priority")} >
        <option value="">Choose Priority</option>
        <option value="high">high</option>
        <option value="low">low</option>
        <option value="medium">medium</option>
    </select>

    <button type='submit'>Add Todo</button>

  </form>
  
  {
    data && <table>
        <thead>
            <tr>
                <th>id</th>
                <th>task</th>
                <th>desc</th>
                <th>priority</th>
                <th>actions</th>

            </tr>
        </thead>
        <tbody>
            {
                data.map(item => <tr key={item._id} className={item.complete ? "bg-green-400" : "bg-red-400"}>
                    <td>{item._id}</td>
                    <td>{item.desc}</td>
                    <td>{item.priority}</td>
                    <td>{item.complete ? "Complete" : "Pending"}</td>
                    <td>
                        {
                            item.complete
                            ? <button onClick={e => handleUpdate(item, false)}>Mark In Complete</button>
                            : <button onClick={e => handleUpdate(item, true)}>Mark Complete</button>
                        }

                        <button onClick={e => handleDelete(item._id as string)}>Remove</button>
                        
                        
                    </td>
                </tr> )
            }
        </tbody>
    </table>
  }
  </>
}

export default Dashbord