import Nav from './components/Nav';
import CardContainer from './components/CardContainer';
import Filter from './components/Filter';
import DialogOverlay from './components/DialogOverlay';
import { useState } from 'react';
import type { Issue, Repo } from './types/github';

function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogCard, setDialogCard] = useState<
    { repo?: Repo; issue?: Issue } | undefined
  >();
  const bodyContainerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    gap: '1rem',
  };
  const openDialog = (cardData: { repo?: Repo; issue?: Issue }) => {
    if (cardData) {
      setDialogCard(cardData);
      setDialogOpen(true);
    }
  };

  return (
    <>
      <Nav />
      <div style={bodyContainerStyles}>
        <Filter />
        <CardContainer onCardClick={openDialog} />
      </div>
      <DialogOverlay
        open={dialogOpen}
        setOpen={setDialogOpen}
        cardData={dialogCard}
      />
    </>
  );
}

export default App;
