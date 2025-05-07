import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig/axiosConfig';
//import { Button } from '@/components/ui/button';

const ProposalList = () => {
  const [proposals, setProposals] = useState([]);
   const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem('@user'));
 const clientId = user._id;
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/users/myProposals/${clientId}`);
        setProposals(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch proposals:', err);
        setError('Failed to load proposals.');
        setLoading(false);
      }
    };
    
    if (clientId) {
      fetchProposals();
    }
  }, [clientId]);

  if (loading) return <div className='text-center py-10'>Loading Proposals...</div>;
  if (error) return <div className='text-center py-10 text-red-500'>{error}</div>;

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-bold mb-4'>My Proposals</h2>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-200'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='p-3 text-left'>Title</th>
              
              <th className='p-3 text-left'>Bid Amount</th>
              <th className='p-3 text-left'>Bid Submitted By</th>
              <th className='p-3 text-left'>Status</th>
             
            </tr>
          </thead>
          <tbody>
            {proposals.map((proposal) => (
              <tr key={proposal._id} className='border-t'>
                <td className='p-3'>{proposal.title}</td>
                <td className='p-3'>Rs : {proposal.bidAmount}</td>
                <td className='p-3'>{proposal.freelancerName}</td>
                <td className='p-3'>{proposal.status}</td>
               
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProposalList;
