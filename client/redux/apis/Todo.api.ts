// srtapi 

import { Todo } from "@/types/Todo"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const todoApi = createApi({
    reducerPath: "todoApi",
    baseQuery: fetchBaseQuery({ 
        // baseUrl: "http://localhost:5001/api/todo" ,
        baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/todo`,
        credentials: "include" // very imp for cookies to work
    }),
    tagTypes: ["todo"],
    endpoints: (builder) => {
        return {
            getTodos: builder.query<Todo[], void>({
                query: () => {
                    return {
                        url: "/",
                        method: "GET"
                    }
                },
                providesTags: ["todo"]
            }),

            // create
            addTodo: builder.mutation<void, Todo>({
                query: todoData => {
                    return {
                        url: "/create",
                        method: "POST",
                        body: todoData
                    }
                },
                invalidatesTags: ["todo"]
            }),

            // update
            updateTodo: builder.mutation<void, Todo>({
                query: todoData => {
                    return {
                        url: "/modify/" + todoData._id as string,
                        method: "PATCH",
                        body: todoData
                    } 
                },
                invalidatesTags: ["todo"]
            }),

            // delete
            deleteTodo: builder.mutation<void, string>({
                query: _id => {
                    return {
                        url: "/remove/" + _id ,
                        method: "DELETE",
                    } 
                },
                invalidatesTags: ["todo"]
            }),
        
        }
    }
})

export const { 
    useGetTodosQuery,
    useAddTodoMutation,
    useUpdateTodoMutation,
    useDeleteTodoMutation
} = todoApi
