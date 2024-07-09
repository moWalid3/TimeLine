import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, query, where, collectionData, doc, deleteDoc, setDoc, updateDoc, getDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Timeline } from '../models/timeline';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private storage = inject(Storage);

  async createTimeline(file: File, title: string, description: string, createdAt: Date | string): Promise<Timeline> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    // Upload image
    let downloadURL = '';
    if (file) {
      const filePath = `timelines/${user.uid}/${new Date().getTime()}_${file.name}`;
      const storageRef = ref(this.storage, filePath);
      await uploadBytes(storageRef, file);
      downloadURL = await getDownloadURL(storageRef);
    }

    // Generate a new document reference with an ID
    const newDocRef = doc(collection(this.firestore, 'timelines'));
    const timelineId = newDocRef.id;

    // Create timeline model
    const timeline: Timeline = {
      id: timelineId,
      userId: user.uid,
      title,
      description,
      imageUrl: downloadURL,
      createdAt
    };

    await setDoc(newDocRef, timeline);
    return timeline;
  }
  
  getTimelines(): Observable<Timeline[]> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    const timelinesCollection = collection(this.firestore, 'timelines');
    const userTimelinesQuery = query(timelinesCollection, where('userId', '==', user.uid));
    return collectionData(userTimelinesQuery) as Observable<Timeline[]>;
  }

  async deleteTimeline(timeline: Timeline): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');
  
    if (timeline.userId !== user.uid) {
      throw new Error('Unauthorized to delete this timeline');
    }
  
    // Delete the image from storage
    const imageRef = ref(this.storage, timeline.imageUrl);
    await deleteObject(imageRef);
  
    // Delete the timeline document
    const timelineRef = doc(this.firestore, 'timelines', timeline.id!);
    await deleteDoc(timelineRef);
  }

  async updateTimeline(timelineId: string, updates: Partial<Timeline>, newFile?: File): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    const timelineRef = doc(this.firestore, 'timelines', timelineId);
    const timeline = await this.getTimelineById(timelineId);

    if (timeline.userId !== user.uid) {
      throw new Error('Unauthorized to update this timeline');
    }

    const updateData: Partial<Timeline> = { ...updates };

    if (newFile) {
      // Delete old image
      const oldImageRef = ref(this.storage, timeline.imageUrl);
      await deleteObject(oldImageRef);

      // Upload new image
      const filePath = `timelines/${user.uid}/${new Date().getTime()}_${newFile.name}`;
      const storageRef = ref(this.storage, filePath);
      await uploadBytes(storageRef, newFile);
      const downloadURL = await getDownloadURL(storageRef);

      updateData.imageUrl = downloadURL;
    }

    await updateDoc(timelineRef, updateData);
  }

  private async getTimelineById(timelineId: string): Promise<Timeline> {
    const timelineRef = doc(this.firestore, 'timelines', timelineId);
    const timelineSnap = await getDoc(timelineRef);
    if (!timelineSnap.exists()) {
      throw new Error('Timeline not found');
    }
    return { id: timelineSnap.id, ...timelineSnap.data() } as Timeline;
  }

}
