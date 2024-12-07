import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import ReviewModel from "../../models/ReviewModel";
import ReviewRequestModel from '../../models/ReviewRequestModel';
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import { LatestReviews } from "./LatestReviews";
import { useOktaAuth } from "@okta/okta-react";

export const BookCheckoutPage = () => {

    const { authState } = useOktaAuth();

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);

    // Review State
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    const [isReviewLeft, setIsReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

    // Loans Count State
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);

    // Is Book Checked Out?
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);

    const bookId = (window.location.pathname).split('/')[2];

    useEffect(() => {
        const fetchBook = async () => {
            const baseUrl: string = `http://localhost:8083/api/books/${bookId}`;

            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();

            const loadedBook: BookModel = {
                id: responseJson.id,
                title: responseJson.title,
                author: responseJson.author,
                description: responseJson.description,
                copies: responseJson.copies,
                copiesAvailable: responseJson.copiesAvailable,
                category: responseJson.category,
                img: responseJson.img,
            };

            setBook(loadedBook);
            setIsLoading(false);
        };
        fetchBook().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        });
    }, [isCheckedOut]);

    useEffect(() => {
        const fetchBookReviews = async () => {
            const reviewUrl = `http://localhost:8083/api/reviews/search/findByBookId?bookId=${bookId}`;
            try {
                const responseReviews = await fetch(reviewUrl);
                if (!responseReviews.ok) {
                    throw new Error('Something went wrong while fetching reviews!');
                }

                const responseJsonReviews = await responseReviews.json();
                const responseData = responseJsonReviews._embedded.reviews;

                const loadedReviews = [];
                let weightedStarReviews = 0;

                for (const review of responseData) {
                    loadedReviews.push({
                        id: review.id,
                        userEmail: review.userEmail,
                        date: review.date,
                        rating: review.rating,
                        book_id: review.bookId,
                        reviewDescription: review.reviewDescription,
                    });
                    weightedStarReviews += review.rating;
                }

                if (loadedReviews.length > 0) {
                    const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
                    setTotalStars(Number(round));
                }

                setReviews(loadedReviews);
                setIsLoadingReview(false);
            } catch (error) {
                setIsLoadingReview(false);
                setHttpError(error.message);
            }
        };

        fetchBookReviews();
    }, [isReviewLeft]);

    useEffect(() => {
        const fetchUserReviewBook = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8083/api/reviews/secure/user/book?bookId=${bookId}`; 
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json' 
                    }
                };
                try {
                    const userReview = await fetch(url, requestOptions);
                    if (!userReview.ok) {
                        throw new Error('Something went wrong while fetching user review!');
                    }
                    const userReviewResponseJson = await userReview.json();
                    setIsReviewLeft(userReviewResponseJson);
                } catch (error) {
                    setIsLoadingUserReview(false);
                    setHttpError(error.message);
                } finally {
                    setIsLoadingUserReview(false);
                }
            }
        };
        fetchUserReviewBook();
    }, [authState, bookId]);

    useEffect(() => {
        const fetchUserCurrentLoansCount = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8083/api/books/secure/currentloans/count`;
                const requestOptions = {
                    method: 'GET',
                    headers: { 
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                     }
                };
                const currentLoansCountResponse = await fetch(url, requestOptions);
                if (!currentLoansCountResponse.ok)  {
                    throw new Error('Something went wrong!');
                }
                const currentLoansCountResponseJson = await currentLoansCountResponse.json();
                setCurrentLoansCount(currentLoansCountResponseJson);
            }
            setIsLoadingCurrentLoansCount(false);
        };
        fetchUserCurrentLoansCount().catch((error: any) => {
            setIsLoadingCurrentLoansCount(false);
            setHttpError(error.message);
        });
    }, [authState, isCheckedOut]);

    useEffect(() => {
        const fetchUserCheckedOutBook = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8083/api/books/secure/ischeckedout/byuser?bookId=${bookId}`; 
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                try {
                    const bookCheckedOut = await fetch(url, requestOptions);
                    if (!bookCheckedOut.ok) {
                        throw new Error('Something went wrong while checking out the book!');
                    }
                    const bookCheckedOutResponseJson = await bookCheckedOut.json();
                    setIsCheckedOut(bookCheckedOutResponseJson);
                } catch (error) {
                    setIsLoadingBookCheckedOut(false);
                    setHttpError(error.message);
                } finally {
                    setIsLoadingBookCheckedOut(false);
                }
            }
        };
        fetchUserCheckedOutBook();
    }, [authState, bookId]);

    if (isLoading || isLoadingReview  || isLoadingCurrentLoansCount || isLoadingBookCheckedOut || isLoadingUserReview) {
        return (
            <SpinnerLoading />
        );
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }

    async function checkoutBook() {
        const url = `http://localhost:8083/api/books/secure/checkout?bookId=${book?.id}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        const checkoutResponse = await fetch(url, requestOptions);
        if (!checkoutResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setIsCheckedOut(true);
    }

    async function submitReview(starInput: number, reviewDescription: string) {
        let bookId: number = 0;
        if (book?.id) {
            bookId = book.id;
        }

        const reviewRequestModel = new ReviewRequestModel(starInput, bookId, reviewDescription);
        const url = `http://localhost:8083/api/reviews/secure`;
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewRequestModel)
        };
        const returnResponse = await fetch(url, requestOptions);
        if (!returnResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setIsReviewLeft(true);
    }

    return (
        <div>
            <div className='container d-none d-lg-block'>
                <div className='row mt-5'>
                    <div className='col-sm-2 col-md-2'>
                        {book?.img ? (
                            <img src={book?.img} width='226' height='349' alt='Book' />
                        ) : (
                            <img 
                                src={require('./../../Images/BooksImages/book-luv2code-1000.png')} 
                                width='226' height='349' alt='Book' 
                            />
                        )}
                    </div>
                    <div className='col-4 col-md-4 container'>
                        <div className='ml-2'>
                            <h2>{book?.title}</h2>
                            <h5 className='text-primary'>{book?.author}</h5>
                            <p className='lead'>{book?.description}</p>
                            <StarsReview rating={totalStars} size={24} />
                        </div>
                    </div>
                    <CheckoutAndReviewBox 
                        book={book} 
                        mobile={false} 
                        currentLoansCount={currentLoansCount}
                        isAuthenticated={authState?.isAuthenticated} 
                        isCheckedOut={isCheckedOut} 
                        checkoutBook={checkoutBook} isReviewLeft ={isReviewLeft} submitReview={submitReview}
                    />
                </div>
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
            </div>

            {/* Mobile Version */}
            <div className='container d-lg-none mt-5'>
                <div className='d-flex justify-content-center align-items-center'>
                    {book?.img ? (
                        <img src={book?.img} width='226' height='349' alt='Book' />
                    ) : (
                        <img 
                            src={require('./../../Images/BooksImages/book-luv2code-1000.png')} 
                            width='226' height='349' alt='Book' 
                        />
                    )}
                </div>
                <div className='mt-4'>
                    <div className='ml-2'>
                        <h2>{book?.title}</h2>
                        <h5 className='text-primary'>{book?.author}</h5>
                        <p className='lead'>{book?.description}</p>
                        <StarsReview rating={totalStars} size={24} />
                    </div>
                </div>
                <CheckoutAndReviewBox 
                    book={book} 
                    mobile={true} 
                    currentLoansCount={currentLoansCount}
                    isAuthenticated={authState?.isAuthenticated} 
                    isCheckedOut={isCheckedOut} 
                    checkoutBook={checkoutBook} isReviewLeft = {isReviewLeft} submitReview={submitReview}
                />
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
            </div>
        </div>
    );
};
