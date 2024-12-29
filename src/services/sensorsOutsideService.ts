import { Firestore } from 'firebase-admin/firestore';

interface SensorData {
  temperature: number | null;
  humidity: number | null;
  timestamp: string;
}

export const getOutsideSensorsData = async (db: Firestore) => {
  const collection = db.collection('sensors-outside');
  const docRef = await collection.get();

  const docsRef = docRef.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as SensorData),
  }));

  const sortedData = docsRef.sort((a, b) => {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });

  return sortedData;
};

export const addOutsideSensorsData = async (db: Firestore, temperature: number | null, humidity: number | null) => {
  const collection = db.collection('sensors-outside');
  const docRef = await collection.add({
    temperature,
    humidity,
    timestamp: new Date().toISOString(),
  });

  return docRef;
};

export const checkDocumentsExistence = async (
  db: Firestore,
  ids: string[]
): Promise<{ existingDocs: FirebaseFirestore.DocumentReference[]; nonExistentIds: string[] }> => {
  const collection = db.collection('sensors-outside');
  const nonExistentIds: string[] = [];
  const existingDocs: FirebaseFirestore.DocumentReference[] = [];

  await Promise.all(
    ids.map(async id => {
      const docRef = collection.doc(id);
      const doc = await docRef.get();
      if (!doc.exists) {
        nonExistentIds.push(id);
      } else {
        existingDocs.push(docRef);
      }
    })
  );

  return { existingDocs, nonExistentIds };
};

export const deleteDocuments = async (db: Firestore, docs: FirebaseFirestore.DocumentReference[]) => {
  const batch = db.batch();
  docs.forEach(docRef => {
    batch.delete(docRef);
  });
  await batch.commit();
};
