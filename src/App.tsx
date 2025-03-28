import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { CatCard } from './components/CatCard';
import { fetchCatImages, fetchBreeds, CatImage, Breed } from './services/api';

const PageBackground = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f0f9ff, #e6e6fa);
  padding: 4rem 1rem;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 900;
  background: linear-gradient(to right, #3b82f6, #6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: #4b5563;
  font-size: 1.25rem;
  max-width: 600px;
  margin: 0 auto;
`;

const FilterSection = styled.div`
  max-width: 800px;
  margin: 0 auto 4rem;
`;

const FilterWrapper = styled.div`
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1rem;
`;

const Select = styled.select`
  flex-grow: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #3b82f6;
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;

const Button = styled.button`
  background: linear-gradient(to right, #3b82f6, #6366f1);
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  justify-content: center;
`;

const CardWrapper = styled.div`
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
`;

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 80px;
  height: 80px;
  border: 8px solid #f3f4f6;
  border-top: 8px solid #3b82f6;
  border-radius: 50%;
  animation: ${spinAnimation} 1s linear infinite;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1.5rem;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #4b5563;
  
  &:hover {
    color: #1f2937;
  }
`;

function App() {
  const [cats, setCats] = useState<CatImage[]>([]);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const loadCats = async (pageNum: number, breedId: string = '') => {
    try {
      const data = await fetchCatImages(pageNum, 8, breedId);
      setCats(prev => pageNum === 1 ? data : [...prev, ...data]);
    } catch (error) {
      console.error('Error fetching cats:', error);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadCats(nextPage, selectedBreed);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [catsData, breedsData] = await Promise.all([
          fetchCatImages(),
          fetchBreeds()
        ]);
        setCats(catsData);
        setBreeds(breedsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleBreedChange = async (breedId: string) => {
    setSelectedBreed(breedId);
    setPage(1);
    await loadCats(1, breedId);
  };

  // const handleLoadMore = () => {
  //   setPage(prev => prev + 1);
  //   loadCats(page + 1, selectedBreed);
  // };

  const handleRefresh = () => {
    setPage(1);
    loadCats(1, selectedBreed);
  };

  const [selectedCat, setSelectedCat] = useState<CatImage | null>(null);

  const handleCatClick = (cat: CatImage) => {
    setSelectedCat(cat);
  };

  return (
    <PageBackground>
      <Container>
        {/* Header */}
        <Header>
          <Title>Whisker Wonders</Title>
          <Subtitle>
            Discover an enchanting collection of feline friends from around the world
          </Subtitle>
        </Header>

        {/* Filters */}
        <FilterSection>
          <FilterWrapper>
            <Select
              value={selectedBreed}
              onChange={(e) => handleBreedChange(e.target.value)}
            >
              <option value="">All Cat Breeds</option>
              {breeds.map((breed) => (
                <option key={breed.id} value={breed.id}>
                  {breed.name}
                </option>
              ))}
            </Select>
            <Button onClick={handleRefresh}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M23 4v6h-6"></path>
                <path d="M20.49 15a9 9 0 1-2.12-9.36L23 10"></path>
              </svg>
              Refresh
            </Button>
          </FilterWrapper>
        </FilterSection>

        {/* Loading State */}
        {loading ? (
          <LoadingSpinner>
            <Spinner />
          </LoadingSpinner>
        ) : (
          <>
            {/* Cat Grid */}
            <GridContainer>
              {cats.map((cat) => (
                <CardWrapper key={cat.id} onClick={() => handleCatClick(cat)}>
                  <CatCard image={cat} />
                </CardWrapper>
              ))}
            </GridContainer>

            {/* Modal */}
            {selectedCat && (
              <Modal onClick={() => setSelectedCat(null)}>
                <ModalContent onClick={(e) => e.stopPropagation()}>
                  <CloseButton onClick={() => setSelectedCat(null)}>×</CloseButton>
                  <img
                    src={selectedCat.url}
                    alt={selectedCat.breeds[0]?.name || 'Cat'}
                    style={{ width: '100%', borderRadius: '1rem', marginBottom: '1.5rem' }}
                  />
                  <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                    {selectedCat.breeds[0]?.name || 'Beautiful Cat'}
                  </h2>
                  {selectedCat.breeds[0] && (
                    <>
                      <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                        {selectedCat.breeds[0].description}
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                        <div>
                          <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Temperament</h3>
                          <p>{selectedCat.breeds[0].temperament}</p>
                        </div>
                        <div>
                          <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Origin</h3>
                          <p>{selectedCat.breeds[0].origin}</p>
                        </div>
                        <div>
                          <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Life Span</h3>
                          <p>{selectedCat.breeds[0].life_span} years</p>
                        </div>
                        <div>
                          <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Weight</h3>
                          <p>{selectedCat.breeds[0].weight?.metric} kg</p>
                        </div>
                      </div>
                    </>
                  )}
                </ModalContent>
              </Modal>
            )}
            {/* Load More */}
            {cats.length > 0 && (
              <div className="text-center mt-12">
                <Button onClick={handleLoadMore}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Load More Cats
                </Button>
              </div>
            )}
          </>
        )}
      </Container>
    </PageBackground>
  );
}

export default App;