import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from './counterSlice';
import type { RootState, AppDispatch } from '../../app/store';

const Counter = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl shadow-lg p-8 gap-6">
      <h2 className="text-4xl font-bold text-indigo-700 drop-shadow mb-4">Count: <span className="text-indigo-900">{count}</span></h2>
      <div className="flex gap-4">
        <button
          className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <button
          className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  );
};

export default Counter;
