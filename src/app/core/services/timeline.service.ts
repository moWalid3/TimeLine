import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, addDoc, query, where, collectionData } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Timeline } from '../models/timeline';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {

  constructor(private auth: Auth, private firestore: Firestore, private storage: Storage) {}

  async createTimeline(file: File, title: string, description: string, createdAt: Date|string): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    // Upload image
    const filePath = `timelines/${user.uid}/${new Date().getTime()}_${file.name}`;
    const storageRef = ref(this.storage, filePath);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // Create timeline model
    const timeline: Timeline = {
      userId: user.uid,
      title,
      description,
      imageUrl: downloadURL,
      createdAt
    };

    const docRef = await addDoc(collection(this.firestore, 'timelines'), timeline);
    return docRef.id;
  }

  getTimelines(): Observable<Timeline[]> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    const timelinesCollection = collection(this.firestore, 'timelines');
    const userTimelinesQuery = query(timelinesCollection, where('userId', '==', user.uid));
    return collectionData(userTimelinesQuery) as Observable<Timeline[]>;
  }
}
