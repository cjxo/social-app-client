import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://fmxmcjqlaotemaanfxlw.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZteG1janFsYW90ZW1hYW5meGx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5MDQ5ODgsImV4cCI6MjA1MDQ4MDk4OH0.q9sOLgZSdX61JUXF3lx0pd6nZF-aGKBMsc3t1WM0H0U");

export default {
  storage: {
    create: async (name) => {
      const queryBucket = await supabase.storage.getBucket(name);
      if (queryBucket.error) {
        const { data, error } 
          = await supabase.storage.createBucket(name, {
            public: true,
            allowedMimeTypes: ["image/png", "image/jpg", "image/svg+xml"]
        });
        
        if (error) {
          console.error(error);
          return false;
        }
      }
      
      return true;
    },
    
    upload: async (bucketName, filename, filetype, filedata) => {
      const { data, error } = await supabase
        .storage
        .from(bucketName)
        .upload(filename, filedata, {
          cacheControl: '3600',
          upsert: true,
          contentType: filetype,
        });

      if (error) {
        console.error(error);
        return false;
    }

      return true;
    },
    
    download: async (bucketName, filename) => {
      const result = await supabase.storage.from(bucketName).download(filename);
      return result;
    },
    
    addImageBuffers: async (dbPosts) => {
      const result = [];
      for (let postIdx = 0; postIdx < dbPosts.length; ++postIdx) {
        const bucketName = "user-" + dbPosts[postIdx].author_id;
        const filename = dbPosts[postIdx].image_name;
        const downloaded = await supabase.storage.from(bucketName).download(filename);
        
        if (downloaded.error) {
          console.error(downloaded.error);
        } else {
          result.push({
            ...dbPosts[postIdx],
            image_data: URL.createObjectURL(downloaded.data),
          });
        }
      }

      return result;
    },

    getImage: async (bucketName, filename) => {
      const downloaded = await supabase.storage.from(bucketName).download(filename);
      if (downloaded.error) {
        console.error(downloaded.error);
        return null;
      }
      return URL.createObjectURL(downloaded.data);
    },
  },
  instance: supabase,
};
