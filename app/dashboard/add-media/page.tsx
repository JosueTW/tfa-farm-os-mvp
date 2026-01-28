'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Video, Mic, Upload, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddMediaPage() {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);

    const insertData = {
      media_type: formData.get('media_type') as string,
      media_date: formData.get('media_date') as string,
      filename: formData.get('filename') as string,
      captured_by: formData.get('captured_by') as string,
      upload_method: 'manual',
      description: formData.get('description') as string,
      tags: (formData.get('tags') as string)?.split(',').map(t => t.trim()).filter(Boolean) || [],
      featured: formData.get('featured') === 'on',
      verified: true
    };

    const { data, error } = await supabase
      .from('field_media')
      .insert(insertData as any);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      setSuccess(true);
      e.currentTarget.reset();
      // Reset the date to today after form reset
      const dateInput = e.currentTarget.querySelector('input[name="media_date"]') as HTMLInputElement;
      if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
      }
    }

    setUploading(false);
  }

  const mediaTypeIcons = {
    photo: Camera,
    video: Video,
    audio: Mic,
  };

  return (
    <div className="min-h-screen bg-tfa-bg-primary p-4 md:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Navigation */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-tfa-text-muted hover:text-tfa-text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <Card className="bg-tfa-card border-tfa-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-tfa-accent/10">
                <Upload className="h-6 w-6 text-tfa-primary dark:text-tfa-accent" />
              </div>
              <div>
                <CardTitle className="text-xl text-tfa-text-primary">Quick Add Field Media</CardTitle>
                <CardDescription className="text-tfa-text-muted">
                  Capture and log field photos, videos, or audio recordings
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {success && (
              <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
                Media added successfully! You can add another entry.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Media Type Selection */}
              <div>
                <label className="block text-sm font-medium text-tfa-text-primary mb-2">
                  Media Type
                </label>
                <select
                  name="media_type"
                  required
                  className="w-full p-3 rounded-lg border border-tfa-border bg-tfa-bg-secondary text-tfa-text-primary focus:outline-none focus:ring-2 focus:ring-tfa-accent"
                >
                  <option value="photo">📷 Photo</option>
                  <option value="video">🎥 Video</option>
                  <option value="audio">🎙️ Audio Recording</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-tfa-text-primary mb-2">
                  Capture Date
                </label>
                <Input
                  type="date"
                  name="media_date"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="bg-tfa-bg-secondary border-tfa-border text-tfa-text-primary"
                />
              </div>

              {/* Filename */}
              <div>
                <label className="block text-sm font-medium text-tfa-text-primary mb-2">
                  Filename
                </label>
                <Input
                  name="filename"
                  required
                  placeholder="IMG_20260128_143022.jpg"
                  className="bg-tfa-bg-secondary border-tfa-border text-tfa-text-primary placeholder:text-tfa-text-muted"
                />
                <p className="text-xs text-tfa-text-muted mt-1">
                  Enter the original filename from your device
                </p>
              </div>

              {/* Captured By */}
              <div>
                <label className="block text-sm font-medium text-tfa-text-primary mb-2">
                  Captured By
                </label>
                <Input
                  name="captured_by"
                  required
                  placeholder="Nick Shapley"
                  className="bg-tfa-bg-secondary border-tfa-border text-tfa-text-primary placeholder:text-tfa-text-muted"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-tfa-text-primary mb-2">
                  Description
                </label>
                <Textarea
                  name="description"
                  required
                  rows={3}
                  placeholder="Multi-cladode stacking visible in Block A. Good spacing observed between plants."
                  className="bg-tfa-bg-secondary border-tfa-border text-tfa-text-primary placeholder:text-tfa-text-muted"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-tfa-text-primary mb-2">
                  Tags
                </label>
                <Input
                  name="tags"
                  placeholder="planting, multi_cladode, block_a, inspection"
                  className="bg-tfa-bg-secondary border-tfa-border text-tfa-text-primary placeholder:text-tfa-text-muted"
                />
                <p className="text-xs text-tfa-text-muted mt-1">
                  Comma-separated tags for categorization
                </p>
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-3 p-4 rounded-lg bg-tfa-bg-secondary border border-tfa-border">
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  className="h-5 w-5 rounded border-tfa-border text-tfa-accent focus:ring-tfa-accent"
                />
                <div>
                  <label htmlFor="featured" className="text-sm font-medium text-tfa-text-primary cursor-pointer">
                    Feature on Dashboard
                  </label>
                  <p className="text-xs text-tfa-text-muted">
                    Show this media in the dashboard gallery
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={uploading}
                className="w-full bg-[#01AB93] hover:bg-[#01E3C2] text-white py-3"
              >
                {uploading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Adding Media...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Add Media Entry
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <div className="mt-6 p-4 rounded-lg bg-tfa-bg-secondary border border-tfa-border">
          <h3 className="text-sm font-medium text-tfa-text-primary mb-2">💡 Quick Tips</h3>
          <ul className="text-xs text-tfa-text-muted space-y-1">
            <li>• Use descriptive filenames that include the date and location</li>
            <li>• Add relevant tags to make media easier to find later</li>
            <li>• Feature important photos that show progress or issues</li>
            <li>• Include worker names in descriptions for accountability</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
