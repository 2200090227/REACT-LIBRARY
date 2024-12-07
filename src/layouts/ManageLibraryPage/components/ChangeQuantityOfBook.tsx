import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import { useOktaAuth } from '@okta/okta-react';

export const ChangeQuantityOfBook: React.FC<{ book: BookModel, deleteBook: () => void }> = (props) => {
    
    const { authState } = useOktaAuth();
    const [quantity, setQuantity] = useState<number>(0);
    const [remaining, setRemaining] = useState<number>(0);

    useEffect(() => {
        const fetchBookInState = () => {
            setQuantity(props.book.copies || 0);
            setRemaining(props.book.copiesAvailable || 0);
        };
        fetchBookInState();
    }, [props.book]);

    async function increaseQuantity() {
        if (!authState?.isAuthenticated) return;
        const url = `http://localhost:8083/api/admin/secure/increase/book/quantity?bookId=${props.book?.id}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        try {
            const quantityUpdateResponse = await fetch(url, requestOptions);
            if (!quantityUpdateResponse.ok) {
                throw new Error('Failed to increase the quantity');
            }
            setQuantity(prevQuantity => prevQuantity + 1);
            setRemaining(prevRemaining => prevRemaining + 1);
        } catch (error) {
            console.error(error);
            alert("Error increasing book quantity");
        }
    }

    async function decreaseQuantity() {
        if (!authState?.isAuthenticated) return;
        const url = `http://localhost:8080/api/admin/secure/decrease/book/quantity?bookId=${props.book?.id}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        try {
            const quantityUpdateResponse = await fetch(url, requestOptions);
            if (!quantityUpdateResponse.ok) {
                throw new Error('Failed to decrease the quantity');
            }
            setQuantity(prevQuantity => prevQuantity - 1);
            setRemaining(prevRemaining => prevRemaining - 1);
        } catch (error) {
            console.error(error);
            alert("Error decreasing book quantity");
        }
    }

    async function deleteBook() {
        if (!authState?.isAuthenticated) return;
        const url = `http://localhost:8080/api/admin/secure/delete/book?bookId=${props.book?.id}`;
        const requestOptions = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        try {
            const deleteResponse = await fetch(url, requestOptions);
            if (!deleteResponse.ok) {
                throw new Error('Failed to delete the book');
            }
            props.deleteBook();
        } catch (error) {
            console.error(error);
            alert("Error deleting book");
        }
    }
    
    return (
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className='row g-0'>
                <div className='col-md-2'>
                    <div className='d-none d-lg-block'>
                        {props.book.img ?
                            <img src={props.book.img} width='123' height='196' alt='Book' />
                            :
                            <img src='/images/book-default.png' width='123' height='196' alt='Default Book' />
                        }
                    </div>
                    <div className='d-lg-none d-flex justify-content-center align-items-center'>
                        {props.book.img ?
                            <img src={props.book.img} width='123' height='196' alt='Book' />
                            :
                            <img src='/images/book-default.png' width='123' height='196' alt='Default Book' />
                        }
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='card-body'>
                        <h5 className='card-title'>{props.book.author}</h5>
                        <h4>{props.book.title}</h4>
                        <p className='card-text'> {props.book.description} </p>
                    </div>
                </div>
                <div className='mt-3 col-md-4'>
                    <div className='d-flex justify-content-center align-items-center'>
                        <p>Total Quantity: <b>{quantity}</b></p>
                    </div>
                    <div className='d-flex justify-content-center align-items-center'>
                        <p>Books Remaining: <b>{remaining}</b></p>
                    </div>
                </div>
                <div className='mt-3 col-md-1'>
                    <div className='d-flex justify-content-start'>
                        <button className='m-1 btn btn-md btn-danger' onClick={deleteBook}>Delete</button>
                    </div>
                </div>
                <div className='d-flex justify-content-between'>
                    <button className='m-1 btn btn-md btn-success' onClick={increaseQuantity}>Add Quantity</button>
                    <button className='m-1 btn btn-md btn-warning' onClick={decreaseQuantity}>Decrease Quantity</button>
                </div>
            </div>
        </div>
    );
};
