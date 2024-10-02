import ShelfCurrentLoans from "../../../models/ShelfCurrentLoans";

interface LoansModalProps {
  shelfCurrentLoan: ShelfCurrentLoans;
  mobile: boolean;
  returnBook: (bookId: number) => void;
  renewLoan: (bookId: number) => void;
}

export const LoansModal: React.FC<LoansModalProps> = (props) => {
  const { shelfCurrentLoan, mobile, returnBook, renewLoan } = props;

  return (
    <div
      className="modal fade"
      id={mobile ? `mobilemodal${shelfCurrentLoan.book.id}` : `modal${shelfCurrentLoan.book.id}`}
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
      key={shelfCurrentLoan.book.id}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">
              Loan Options
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="container">
              <div className="mt-3">
                <div className="row">
                  <div className="col-2">
                    {shelfCurrentLoan.book?.img ? (
                      <img
                        src={shelfCurrentLoan.book?.img}
                        width="56"
                        height="87"
                        alt={`${shelfCurrentLoan.book.title} cover`}
                      />
                    ) : (
                      <img
                        src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                        width="56"
                        height="87"
                        alt="Default book cover"
                      />
                    )}
                  </div>
                  <div className="col-10">
                    <h6>{shelfCurrentLoan.book.author}</h6>
                    <h4>{shelfCurrentLoan.book.title}</h4>
                  </div>
                </div>
                <hr />
                {shelfCurrentLoan.daysLeft > 0 && (
                  <p className="text-secondary">Due in {shelfCurrentLoan.daysLeft} days.</p>
                )}
                {shelfCurrentLoan.daysLeft === 0 && <p className="text-success">Due Today.</p>}
                {shelfCurrentLoan.daysLeft < 0 && (
                  <p className="text-danger">Past due by {Math.abs(shelfCurrentLoan.daysLeft)} days.</p>
                )}
                <div className="list-group mt-3">
                  <button
                    onClick={() => returnBook(shelfCurrentLoan.book.id)}
                    data-bs-dismiss="modal"
                    className="list-group-item list-group-item-action"
                    aria-current="true"
                  >
                    Return Book
                  </button>

                  <button
                    onClick={() => renewLoan(shelfCurrentLoan.book.id)}
                    data-bs-dismiss="modal"
                    className={`list-group-item list-group-item-action ${
                      shelfCurrentLoan.daysLeft < 0 ? "disabled" : ""
                    }`}
                    disabled={shelfCurrentLoan.daysLeft < 0}
                  >
                    {shelfCurrentLoan.daysLeft < 0
                      ? "Late dues cannot be renewed"
                      : "Renew loan for 7 days"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
