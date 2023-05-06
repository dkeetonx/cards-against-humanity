import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { redrawHand } from '../Cards/cardsSlice';

import { setShowRedrawModal, selectShowRedrawModal } from '../Overlays/overlaysSlice';

export default function RedrawModal(props) {
    const show = useSelector(selectShowRedrawModal);
    const dispatch = useDispatch();

    const [processing, setProcessing] = useState(false);
    async function handleRedraw() {
        console.log("redrawing");

        setProcessing(true);
        try {
            await dispatch(redrawHand()).unwrap();
        }
        catch (error) {
            console.log(error);
        }
        setProcessing(false);
        dispatch(setShowRedrawModal(false));
    }

    return (
        <div>
            <input type="checkbox" className="modal-toggle" id="redraw-modal" readOnly checked={show} />
            <label className="modal cursor-pointer" onClick={() => dispatch(setShowRedrawModal(false))}>
                <label className="modal-box relative">
                    <label className="btn btn-sm btn-circle absolute right-2 top-2"
                        onClick={() => dispatch(setShowRedrawModal(false))}>✕</label>
                    <h3 className="font-bold text-lg">Are you sure?</h3>
                    <p className="py-4">
                        This will discard all the cards in your hand and draw new ones.
                    </p>
                    <div className="modal-action">
                        <label
                            className={`btn ${processing ? "loading":""}`}
                            onClick={handleRedraw}
                        >
                            {processing ? "":"Redraw"}
                        </label>
                    </div>
                </label>
            </label>
        </div>
    );
}